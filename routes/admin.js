const express = require('express');
const router = express.Router();
const {verifyToken, requireRole} = require('../middleware/auth');

router.get('/', verifyToken,requireRole('admin'), (req, res) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ message: 'Accès refusé : réservé aux utilisateurs admin' });
  res.json({ message: `Bienvenue admin ${req.user.username}` });
});





     


module.exports = router;