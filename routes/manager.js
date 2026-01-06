const express = require('express');
const router = express.Router();
const {verifyToken, requireRole} = require('../middleware/auth');

/**
 * GET /manager
 * Route de test pour vérifier que l'utilisateur a le rôle 'manager'
 * La vérification du rôle est déjà faite par requireRole('manager')
 */
router.get('/', verifyToken, requireRole('manager'), (req, res) => {
  res.json({
    ok: true,
    message: `Bienvenue manager ${req.user.username}`,
    data: { role: req.user.role, squad: req.user.squad }
  });
});




/**
 * GET /manager/stats
 * Retourne les ventes de tous les users de la squad du manager connecté
 * Authentification: JWT requis (role: manager)
 * Response: { ok, data: [ {user, ventes: [...]}, ... ] }
 */
router.get('/stats', verifyToken, requireRole('manager'), async (req, res) => {
  try {
    const logger = require('../config/logger');
    logger.info(`[DEBUG] req.user complet: ${JSON.stringify(req.user)}`);
    const squad = req.user.squad;
    logger.info(`[DEBUG] manager id=${req.user.id} squad=${squad}`);
    if (!squad) {
      logger.warn(`[DEBUG] manager id=${req.user.id} n'a pas de squad`);
      res.setHeader('Content-Type', 'application/json');
      logger.info('[DEBUG] Retour JSON erreur squad manquante');
      return res.status(400).json({ ok: false, message: "Aucune squad associée à ce manager." });
    }
    // Récupérer tous les users de la squad
    const db = require('../config/db');
    const [users] = await db.query(
      'SELECT id, username FROM users WHERE squad = ? AND role = ? ORDER BY username',
      [squad, 'user']
    );
    logger.info(`[DEBUG] users trouvés pour squad ${squad}: ${JSON.stringify(users)}`);
    // Pour chaque user, récupérer ses ventes
    const ventesParUser = [];
    for (const user of users) {
      const [ventes] = await db.query(
        `SELECT id_vente, id_produit, quantite, adresse, date_vente
         FROM vente WHERE id_user = ? ORDER BY date_vente DESC`,
        [user.id]
      );
      logger.info(`[DEBUG] ventes pour user ${user.id}: ${JSON.stringify(ventes)}`);
      ventesParUser.push({ user, ventes });
    }
    
    logger.info(`Stats squad ${squad}: ${users.length} utilisateurs`);
    return res.status(200).json({ ok: true, data: ventesParUser });
  } catch (err) {
    const logger = require('../config/logger');
    logger.error('Erreur route /manager/stats', err);
    return res.status(500).json({ ok: false, message: "Erreur serveur interne" });
  }
});

module.exports = router;