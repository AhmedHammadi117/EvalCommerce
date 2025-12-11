const express = require('express');
const router = express.Router();
const {verifyToken, requireRole} = require('../middleware/auth');

/**
 * GET /user
 * Route de test pour vérifier que l'utilisateur a le rôle 'user'
 * La vérification du rôle est déjà faite par requireRole('user')
 */
router.get('/', verifyToken, requireRole('user'), (req, res) => {
  res.json({
    ok: true,
    message: `Bienvenue utilisateur ${req.user.username}`,
    data: { role: req.user.role, squad: req.user.squad, id: req.user.id }
  });
});





     


module.exports = router;
