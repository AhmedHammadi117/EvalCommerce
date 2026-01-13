
// Routes ventes : ajout et historique (utilisateur)
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');

/**
 * Enregistre une nouvelle vente et retourne l'historique complet
 * Authentification: JWT requis (role: user)
 * 
 * Body: { id_produit, quantite, adresse }
 * Response: { ok, message, data: { id_vente, historique } }
 */
router.post('/add', verifyToken, requireRole('user'), async (req, res) => {
  try {
    const { id_produit, quantite, adresse } = req.body;
    const id_user = req.user.id;

    // Validation des champs
    if (!id_produit || !quantite || !adresse) {
      return res.status(400).json({
        ok: false,
        message: 'Champs manquants (id_produit, quantite, adresse requis)'
      });
    }

    // Insertion de la nouvelle vente
    const [resultInsert] = await db.query(
      `INSERT INTO vente (id_user, id_produit, quantite, adresse)
       VALUES (?, ?, ?, ?)`,
      [id_user, id_produit, quantite, adresse]
    );

    // Récupération de l'historique complet
    const [ventes] = await db.query(
      `SELECT id_vente, id_produit, quantite, adresse, date_vente
       FROM vente
       WHERE id_user = ?
       ORDER BY date_vente DESC`,
      [id_user]
    );

    // Réponse standardisée
    return res.status(201).json({
      ok: true,
      message: 'Vente ajoutée avec succès',
      data: {
        id_vente: resultInsert.insertId,
        historique: ventes
      }
    });

  } catch (err) {
    // Erreur serveur lors de l'ajout de vente
    return res.status(500).json({ ok: false, message: 'Erreur serveur interne' });
  }
});

/**
 * GET /vente
 * Récupère l'historique des ventes de l'utilisateur
 * Authentification: JWT requis (role: user)
 * 
 * Response: { ok, data: [...ventes] }
 */
router.get('/', verifyToken, requireRole('user'), async (req, res) => {
  try {
    const id_user = req.user.id;

    const [ventes] = await db.query(
      `SELECT id_vente, id_produit, quantite, adresse, date_vente
       FROM vente
       WHERE id_user = ?
       ORDER BY date_vente DESC`,
      [id_user]
    );

    return res.status(200).json({
      ok: true,
      data: ventes
    });

  } catch (err) {
    logger.error('Erreur route GET /vente', err);
    return res.status(500).json({
      ok: false,
      message: 'Erreur serveur interne'
    });
  }
});


module.exports = router;
