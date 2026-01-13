// Point d'entrée backend : configuration Express, CORS, routes, démarrage serveur
const express = require('express');
const cors = require('cors');
const path = require('path');
const os = require('os');
require('dotenv').config();

const app = express();
const logger = require('./config/logger');

// Petite fonction pour récupérer l'IP locale du PC (ex: 192.168.x.x)
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) return net.address;
    }
  }
  return 'localhost';
}

// Importation des routes principales
const loginRoute = require('./routes/login');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin_new');
const managerRoutes = require('./routes/manager');
const venteRoutes = require('./routes/vente');
const messageRoutes = require('./routes/message');

const PORT = process.env.PORT || 3000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

// CORS : autorise le frontend sur localhost ET sur l'IP du PC (pour accès téléphone)
app.use(cors({
  origin: [FRONTEND_ORIGIN, `http://${getLocalIP()}:5173`],
  credentials: true
}));

app.use(express.json());

// Statique (optionnel)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
} else {
  app.use('/templates', express.static(path.join(__dirname, 'public/templates')));
}

// Montage des routes REST
app.use('/login', loginRoute);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/manager', managerRoutes);
app.use('/vente', venteRoutes);
app.use('/api/message', messageRoutes);

// Démarrage serveur (accessible sur le réseau)
app.listen(PORT, "0.0.0.0", () => {
  logger.info(`Serveur démarré sur http://0.0.0.0:${PORT}`);
});

module.exports = app;
