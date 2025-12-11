const express = require('express');
const router = express.Router();
const {verifyToken, requireRole} = require('../middleware/auth');

/**
 * GET /manager
 * Route de test pour vérifier que l'utilisateur a le rôle 'manager'
 * La vérification du rôle est déjà faite par requireRole('manager')
 */
router.get('/', verifyToken, requireRole('manager'), (req, res) => {
  res.json({
    ok: true,
    message: `Bienvenue manager ${req.user.username}`,
    data: { role: req.user.role, squad: req.user.squad }
  });
});





     


module.exports = router;