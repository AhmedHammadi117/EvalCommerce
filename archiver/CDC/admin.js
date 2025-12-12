// Route simple de test admin: nécessite JWT + rôle 'admin'
const express = require('express');
const router = express.Router();
const {verifyToken, requireRole} = require('../../middleware/auth');

/**
 * GET /admin
 * Route de test pour vérifier que l'utilisateur a le rôle 'admin'
 * La vérification du rôle est déjà faite par requireRole('admin')
 */
router.get('/', verifyToken, requireRole('admin'), (req, res) => {
  res.json({
    ok: true,
    message: `Bienvenue admin ${req.user.username}`,
    data: { role: req.user.role }
  });
});





     


module.exports = router;