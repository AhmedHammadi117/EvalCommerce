const express = require('express');
const jwt = require('jsonwebtoken');  // Pour la gestion des tokens JWT
const router = express.Router();
const pool = require('../config/db');  // Importation de la configuration de la base de données
const bcrypt = require('bcryptjs'); // Pour le hachage des mots de passe
require('dotenv').config();        // Pour charger les variables d'environnement depuis le fichier .env



// POST /login
router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;    // Récupération des données de connexion
    if (!username || !password) return res.status(400).json({ message: 'deux champs manque' });

    const [rows] = await pool.query('SELECT id, username, password, role FROM users WHERE username = ?', [username]);
    // Recherche de l'utilisateur dans la base de données
    const user = rows[0]; // Supposons que les colonnes sont id, username, password, role 
    if (!user) return res.status(401).json({ message: 'username invalide' });

    const match = await bcrypt.compare(password, user.password); // Comparaison du mot de passe fourni avec le mot de passe haché en base
    if (!match) return res.status(401).json({ message: 'password invalide' }); 

    const payload = { id: user.id, username: user.username, role: user.role }; // Création du payload pour le token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });     // Génération du token JWT

    res.json({message: 'Connexion réussie', token, user: { id: user.id, username: user.username, role: user.role } }); // Réponse avec le token et les informations utilisateur
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


module.exports = router;
