const express = require('express');
const router = express.Router();
const {verifyToken, requireRole} = require('../middleware/auth');

router.get('/', verifyToken, requireRole('manager'), (req, res) => {
  if (req.user.role !== 'manager')
    return res.status(403).json({ message: 'Accès refusé : réservé aux utilisateurs normaux' });
  res.json({ message: `Bienvenue manager ${req.user.username}` });
});





     


module.exports = router;