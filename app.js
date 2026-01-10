
// Point d'entrée backend : configuration Express, CORS, routes, démarrage serveur
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const logger = require('./config/logger');

// Importation des routes principales
const loginRoute = require('./routes/login');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin_new');
const managerRoutes = require('./routes/manager');
const venteRoutes = require('./routes/vente');
const messageRoutes = require('./routes/message');

const PORT = process.env.PORT || 3000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(express.json());

// Statique : templates prod ou accès dev
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public'));
} else {
  app.use('/templates', express.static('public/templates'));
}

// Montage des routes REST
app.use('/login', loginRoute);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/manager', managerRoutes);
app.use('/vente', venteRoutes);
app.use('/api/message', messageRoutes);

// Démarrage serveur
app.listen(PORT, () => logger.info(`Serveur démarré sur http://localhost:${PORT}`));
app.use('/api/message', messageRoutes);
module.exports = app;


