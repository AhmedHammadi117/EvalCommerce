// app.js
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.static('public')); // sert les fichiers dans ./public
app.use(express.json());
const PORT = 5000;
const SECRET = 'secret123';

const users = [
  { id: 1, username: 'Alice', password: '1234', role: 'admin', squad: null },
  { id: 2, username: 'manager', password: 'abcd', role: 'manager', squad: 'A' },
  { id: 3, username: 'user', password: '0000', role: 'user', squad: 'A' },
  { id: 4, username: 'user2', password: '1111', role: 'user', squad: 'A' }
];

// --- stockage temporaire des ventes (en mémoire) ---
let sales = []; // chaque élément : { id, userId, sale_date, location, product, amount, client_score }

// -------------------- LOGIN --------------------
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Identifiants invalides' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role, squad: user.squad },
    SECRET,
    { expiresIn: '1h' }
  );

  return res.status(200).json({
    message: 'Connexion réussie',
    token,
    role: user.role
  });
});

// -------------------- MIDDLEWARE pour vérifier token --------------------
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Aucun token fourni' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token invalide ou expiré' });
    req.user = decoded; // { id, username, role, squad, iat, exp }
    next();
  });
};

// middleware pour vérifier rôle
const requireRole = (role) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Non authentifié' });
  if (req.user.role !== role) return res.status(403).json({ message: 'Accès refusé' });
  next();
};

// -------------------- ROUTES PROTÉGÉES POUR RÔLES (exemples existants) --------------------
app.get('/admin', verifyToken, (req, res) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ message: 'Accès refusé : réservé à l’administrateur' });
  res.json({ message: `Bienvenue Admin ${req.user.username}` });
});

app.get('/manager', verifyToken, (req, res) => {
  if (req.user.role !== 'manager')
    return res.status(403).json({ message: 'Accès refusé : réservé au gestionnaire' });
  res.json({ message: `Bienvenue Manager ${req.user.username}` });
});

app.get('/user', verifyToken, (req, res) => {
  if (req.user.role !== 'user')
    return res.status(403).json({ message: 'Accès refusé : réservé aux utilisateurs normaux' });
  res.json({ message: `Bienvenue Utilisateur ${req.user.username}` });
});

// -------------------- API SALES --------------------
const fs = require('fs');
const path = require('path');
const salesFile = path.join(__dirname, 'data', 'sales.json');

// Route pour ajouter une vente (accessible uniquement à un "user")
app.post('/sales', verifyToken, (req, res) => {
  if (req.user.role !== 'user')
    return res.status(403).json({ message: 'Accès refusé : réservé aux commerciaux' });

  const { client, produit, montant, satisfaction } = req.body;

  if (!client || !produit || !montant || !satisfaction) {
    return res.status(400).json({ message: 'Données manquantes' });
  }

  // Créer une nouvelle vente
  const newSale = {
    id: Date.now(),
    userId: req.user.id,
    client,
    produit,
    montant,
    satisfaction,
    date: new Date().toISOString()
  };

  // Charger les ventes existantes
  let sales = [];
  if (fs.existsSync(salesFile)) {
    const data = fs.readFileSync(salesFile);
    sales = JSON.parse(data);
  }

  // Ajouter la nouvelle vente
  sales.push(newSale);

  // Sauvegarder dans le fichier
  fs.writeFileSync(salesFile, JSON.stringify(sales, null, 2));

  res.status(201).json({ message: 'Vente enregistrée avec succès', sale: newSale });
});

// Route pour récupérer les ventes d’un utilisateur
app.get('/sales', verifyToken, (req, res) => {
  if (req.user.role !== 'user')
    return res.status(403).json({ message: 'Accès refusé : réservé aux commerciaux' });

  const data = fs.readFileSync(salesFile);
  const sales = JSON.parse(data);

  // Filtrer les ventes de cet utilisateur
  const userSales = sales.filter(s => s.userId === req.user.id);
  res.json(userSales);
});


// (Optionnel) DELETE /api/sales/:id -> supprimer une vente (owner ou admin)
app.delete('/api/sales/:id', verifyToken, (req, res) => {
  const id = Number(req.params.id);
  const idx = sales.findIndex(s => s.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Vente introuvable' });
  const sale = sales[idx];

  if (req.user.role === 'admin' || (req.user.role === 'user' && sale.userId === req.user.id)) {
    sales.splice(idx, 1);
    return res.json({ message: 'Vente supprimée' });
  }

  return res.status(403).json({ message: 'Accès refusé' });
});

app.listen(PORT, () => console.log(`✅ Serveur démarré sur http://localhost:${PORT}`));


// DEBUG: liste complète (admin seulement) — utile pour vérifier le contenu réel de la table
router.get('/debug/all', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const db = require('../config/db');
    const [rows] = await db.execute('SELECT * FROM MESSAGE ORDER BY dateEnvoi DESC');
    res.json(rows);
  } catch (err) {
    console.error('Erreur debug/messages:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// TEST: endpoint simple pour vérifier la connexion front -> back
router.post('/test', (req, res) => {
  try {
    console.log('DEBUG /api/messages/test body:', req.body);
    res.json({ ok: true, received: req.body });
  } catch (err) {
    console.error('Erreur /api/messages/test:', err);
    res.status(500).json({ ok: false, message: 'Erreur serveur' });
  }
});
