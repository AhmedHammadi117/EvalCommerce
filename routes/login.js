const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
require('dotenv').config();



// POST /login
router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'deux champs manque' });

    const [rows] = await pool.query('SELECT id, username, password, role FROM users WHERE username = ?', [username]);
    const user = rows[0];
    if (!user) return res.status(401).json({ message: 'username invalide' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'password invalide' });

    const payload = { id: user.id, username: user.username, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
    const response = { ok: true, message: 'Connexion réussie', token, user: { id: user.id, username: user.username, role: user.role } };
    console.log("👤 Utilisateur :", response.user.username, "| Rôle :", response.user.role);

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: 'Erreur serveur' });
  }
  

});


module.exports = router;
