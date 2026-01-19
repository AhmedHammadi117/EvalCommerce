const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// ================= RESET MOT DE PASSE =================
/**
 * Route POST /reset-password
 * Vérifie l'identité (username, nom, prénom, date_naissance) puis met à jour le mot de passe (hashé)
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { username, nom, prenom, date_naissance, new_password } = req.body;
    if (!username || !nom || !prenom || !date_naissance || !new_password) {
      return res.status(400).json({ ok: false, message: 'Tous les champs sont requis' });
    }
    // Vérifier l'identité
    const [rows] = await pool.query(
      'SELECT id FROM users WHERE username = ? AND nom = ? AND prenom = ? AND date_naissance = ?',
      [username, nom, prenom, date_naissance]
    );
    if (!rows || rows.length === 0) {
      return res.status(404).json({ ok: false, message: 'Aucun utilisateur ne correspond à ces informations' });
    }
    // Hasher le nouveau mot de passe
    const hashed = await bcrypt.hash(new_password, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, rows[0].id]);
    return res.json({ ok: true, message: 'Mot de passe réinitialisé avec succès.' });
  } catch (err) {
    const logger = require('../config/logger');
    logger.error('Erreur route /reset-password', err);
    res.status(500).json({ ok: false, message: 'Erreur serveur' });
  }
});
// ================= MOT DE PASSE OUBLIÉ =================
/**
 * Route POST /forgot-password
 * Vérifie l'identité de l'utilisateur via username, nom, prénom, date_naissance
 * Si OK, renvoie un message de succès (ou un token de reset, à implémenter si besoin)
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { username, nom, prenom, date_naissance } = req.body;
    if (!username || !nom || !prenom || !date_naissance) {
      return res.status(400).json({ ok: false, message: 'Tous les champs sont requis' });
    }
    // Recherche de l'utilisateur avec tous les critères
    const [rows] = await pool.query(
      'SELECT id FROM users WHERE username = ? AND nom = ? AND prenom = ? AND date_naissance = ?',
      [username, nom, prenom, date_naissance]
    );
    if (!rows || rows.length === 0) {
      return res.status(404).json({ ok: false, message: 'Aucun utilisateur ne correspond à ces informations' });
    }
    // Ici, on pourrait générer un token de reset ou envoyer un email (à implémenter)
    return res.json({ ok: true, message: 'Identité vérifiée. Vous pouvez réinitialiser votre mot de passe.' });
  } catch (err) {
    const logger = require('../config/logger');
    logger.error('Erreur route /forgot-password', err);
    res.status(500).json({ ok: false, message: 'Erreur serveur' });
  }
});




// POST /login
router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'champs manque' });

    // On récupère aussi le champ squad (utile pour les managers)
    const [rows] = await pool.query('SELECT id, username, password, role, squad FROM users WHERE username = ?', [username]);
    const user = rows[0];
    if (!user) return res.status(401).json({ message: 'username invalide' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'password invalide' });

    // Ajout du champ squad dans le token si manager
    const payload = { id: user.id, username: user.username, role: user.role };
    if (user.role === 'manager') {
      payload.squad = user.squad;
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
    const response = { 
      ok: true, 
      message: 'Connexion réussie', 
      token, 
      user: { id: user.id, username: user.username, role: user.role, squad: user.squad }
    };
    const logger = require('../config/logger');
    logger.info(`Utilisateur : ${response.user.username} | Rôle : ${response.user.role}`);

    res.json(response);
  } catch (err) {
    const logger = require('../config/logger');
    logger.error('Erreur route /login', err);
    res.status(500).json({ ok: false, message: 'Erreur serveur' });
  }
  

});


module.exports = router;
