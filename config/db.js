// config/db.js
require('dotenv').config();  // Charger les variables d'environnement
const mysql = require('mysql2/promise'); // Utilisation de mysql2 avec support des Promises
// Création du pool de connexions
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'siteDB',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool; // Exporter le pool pour l'utiliser dans d'autres fichiers