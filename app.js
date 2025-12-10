const express = require('express');
const app = express();
const cors = require('cors');
// Importation des routes
const loginRoute = require('./routes/login');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const managerRoutes = require('./routes/manager');
const venteRoutes = require('./routes/vente');
const messageRoutes = require('./routes/message');


const PORT = 3000;
app.use(cors());
app.use(express.static('public')); // sert les fichiers dans ./public
app.use(express.json());


// Montage des routes
app.use('/login', loginRoute);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/manager', managerRoutes);
app.use('/vente', venteRoutes);
app.use('/api/message', messageRoutes);





app.listen(PORT, () => console.log(` Serveur démarré sur http://localhost:${PORT}`));







