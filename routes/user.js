const express = require('express');
const router = express.Router();
const {verifyToken, requireRole} = require('../middleware/auth');

router.get('/', verifyToken, requireRole('user'), (req, res) => {
  if (req.user.role !== 'user')
    return res.status(403).json({ message: 'Accès refusé : réservé aux utilisateurs normaux' });
  res.json({ message: `Bienvenue Utilisateur ${req.user.username}` });
});





     


module.exports = router;
