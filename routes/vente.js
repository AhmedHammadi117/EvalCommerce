// routes/vente.js
const express = require('express');
const router = express.Router();
const db = require('../config/db'); // connexion MySQL (callback style possible)
const { verifyToken, requireRole } = require('../middleware/auth');

// POST /vente/add  -> ajouter une vente puis renvoyer l'historique de l'utilisateur
router.post('/add', verifyToken, requireRole('user'), async (req, res) => {
  try {
    console.log('🟢 Requête reçue /vente/add ->', req.body, 'user:', req.user.id);

    const { id_produit, quantite, adresse } = req.body;
    const id_user = req.user.id;

    if (!id_produit || !quantite || !adresse) {
      return res.status(400).json({ message: 'Champs manquants.' });
    }

    // 1️ Insertion
    const [resultInsert] = await db.query(
      `INSERT INTO vente (id_user, id_produit, quantite, adresse)
       VALUES (?, ?, ?, ?)`,
      [id_user, id_produit, quantite, adresse]
    );
    console.log(' Insert OK ID:', resultInsert.insertId);

    // 2️ Historique
    const [ventes] = await db.query(
      `SELECT id_vente, id_produit, quantite, adresse, date_vente
       FROM vente
       WHERE id_user = ?
       ORDER BY date_vente DESC`,
      [id_user]
    );
    console.log(' Historique trouvé:', ventes.length, 'ventes');

    // 3️ Réponse au client
    return res.status(201).json({
      message: 'Vente ajoutée avec succès.',
      id_vente: resultInsert.insertId,
      historique: ventes
    });

  } catch (err) {
    console.error(' Erreur route /vente/add:', err);
    return res.status(500).json({ message: 'Erreur interne serveur.' });
  }
});


module.exports = router;
