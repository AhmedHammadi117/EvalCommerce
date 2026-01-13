
// Routes utilisateurs : accès et infos (rôle user)
const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');

// GET /user : test rôle user
router.get('/', verifyToken, requireRole('user'), (req, res) => {
  res.json({
    ok: true,
    message: `Bienvenue utilisateur ${req.user.username}`,
    data: { role: req.user.role, squad: req.user.squad, id: req.user.id }
  });
});





     


module.exports = router;
