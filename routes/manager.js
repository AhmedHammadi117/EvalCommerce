// Routes manager : accès et stats (rôle manager)
const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');

// GET /manager : test rôle manager
router.get('/', verifyToken, requireRole('manager'), (req, res) => {
  res.json({
    ok: true,
    message: `Bienvenue manager ${req.user.username}`,
    data: { role: req.user.role, squad: req.user.squad }
  });
});

// GET /manager/stats : ventes de l'équipe du manager connecté
router.get('/stats', verifyToken, requireRole('manager'), async (req, res) => {
  try {
    const squad = req.user.squad;
    if (!squad) {
      return res.status(400).json({ ok: false, message: "Aucune équipe associée à ce manager." });
    }
    // Récupérer tous les users de l'équipe
    const db = require('../config/db');
    const [users] = await db.query(
      'SELECT id, username FROM users WHERE squad = ? AND role = ? ORDER BY username',
      [squad, 'user']
    );
    // Pour chaque user, récupérer ses ventes
    const ventesParUser = [];
    for (const user of users) {
      const [ventes] = await db.query(
        `SELECT id_vente, id_produit, quantite, adresse, date_vente FROM vente WHERE id_user = ? ORDER BY date_vente DESC`,
        [user.id]
      );
      ventesParUser.push({ user, ventes });
    }
    return res.status(200).json({ ok: true, data: ventesParUser });
  } catch (err) {
    return res.status(500).json({ ok: false, message: 'Erreur serveur interne' });
  }
});

module.exports = router;