// backend entrypoint: configure middleware, routes and start server
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const logger = require('./config/logger');
// Importation des routes
const loginRoute = require('./routes/login');
const userRoutes = require('./routes/user');
// use the enhanced admin routes if present
const adminRoutes = require('./routes/admin_new'); //|| require('./routes/admin')
const managerRoutes = require('./routes/manager');
const venteRoutes = require('./routes/vente');
const messageRoutes = require('./routes/message');



const PORT = process.env.PORT || 3000;

// CORS: allow frontend origin from env or default to Vite dev server
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: FRONTEND_ORIGIN }));

// Serve static templates only in production; while developing React we use client dev server
if (process.env.NODE_ENV === 'production') {
	app.use(express.static('public'));
} else {
	// keep the templates for reference under public/templates
	app.use('/templates', express.static('public/templates'));
}
app.use(express.json());


// Montage des routes
app.use('/login', loginRoute);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/manager', managerRoutes);
app.use('/vente', venteRoutes);
app.use('/api/message', messageRoutes);





app.listen(PORT, () => logger.info(`Serveur démarré sur http://localhost:${PORT}`));







