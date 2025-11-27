const express = require('express');  // Importation d'Express
const app = express();
const cors = require('cors');              // Importation du middleware CORS pour gérer les requêtes cross-origin
// Importation des routes
const loginRoute = require('./routes/login');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const managerRoutes = require('./routes/manager');



const PORT = 3000;
app.use(cors());
app.use(express.static('public')); // sert les fichiers dans ./public
app.use(express.json());


// Montage des routes
app.use('/login', loginRoute);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/manager', managerRoutes);








app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));







