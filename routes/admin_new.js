// filepath: routes/admin.js
/**
 * Routes admin - Gestion des utilisateurs et statistiques
 * Tous les endpoints nécessitent le rôle 'admin'
 */
const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const {
  getAllUsersController,
  getUserByIdController,
  createUserController,
  updateUserController,
  deleteUserController,
  getStatsController,
  getSalesStatsController,
  getSalesPerUserController,
  getProductStatsController,
  getMessageStatsController,
  getSquadStatsController,
  getAllVentesController,
  getAllMessagesController
} = require('../controllers/adminController');

// ========== UTILISATEURS MANAGEMENT ==========

/**
 * GET /admin/users
 * Récupère la liste de tous les utilisateurs
 * Rôle requis: admin
 */
router.get('/users',
  verifyToken,
  requireRole('admin'),
  getAllUsersController
);

/**
 * GET /admin/users/:id
 * Récupère un utilisateur spécifique par ID
 * Rôle requis: admin
 */
router.get('/users/:id',
  verifyToken,
  requireRole('admin'),
  getUserByIdController
);

/**
 * POST /admin/users
 * Crée un nouvel utilisateur
 * Rôle requis: admin
 * Body: { username, password, role, squad? }
 */
router.post('/users',
  verifyToken,
  requireRole('admin'),
  createUserController
);

/**
 * PUT /admin/users/:id
 * Modifie un utilisateur existant
 * Rôle requis: admin
 * Body: { username, role, squad? }
 */
router.put('/users/:id',
  verifyToken,
  requireRole('admin'),
  updateUserController
);

/**
 * DELETE /admin/users/:id
 * Supprime un utilisateur
 * Rôle requis: admin
 */
router.delete('/users/:id',
  verifyToken,
  requireRole('admin'),
  deleteUserController
);

// ========== STATISTIQUES & ANALYTICS ==========

/**
 * GET /admin/stats
 * Récupère un tableau de bord complet avec toutes les statistiques
 * Rôle requis: admin
 */
router.get('/stats',
  verifyToken,
  requireRole('admin'),
  getStatsController
);

/**
 * GET /admin/stats/sales
 * Statistiques des ventes générales
 * Rôle requis: admin
 */
router.get('/stats/sales',
  verifyToken,
  requireRole('admin'),
  getSalesStatsController
);

/**
 * GET /admin/stats/sales-by-user
 * Statistiques des ventes par vendeur
 * Rôle requis: admin
 */
router.get('/stats/sales-by-user',
  verifyToken,
  requireRole('admin'),
  getSalesPerUserController
);

/**
 * GET /admin/stats/products
 * Statistiques des produits (les plus vendus)
 * Rôle requis: admin
 */
router.get('/stats/products',
  verifyToken,
  requireRole('admin'),
  getProductStatsController
);

/**
 * GET /admin/stats/messages
 * Statistiques des messages
 * Rôle requis: admin
 */
router.get('/stats/messages',
  verifyToken,
  requireRole('admin'),
  getMessageStatsController
);

/**
 * GET /admin/stats/squads
 * Statistiques par squad
 * Rôle requis: admin
 */
router.get('/stats/squads',
  verifyToken,
  requireRole('admin'),
  getSquadStatsController
);

/**
 * GET /admin/ventes
 * Récupère toutes les ventes avec détails
 * Rôle requis: admin
 */
router.get('/ventes',
  verifyToken,
  requireRole('admin'),
  getAllVentesController
);

/**
 * GET /admin/messages
 * Récupère tous les messages avec détails
 * Rôle requis: admin
 */
router.get('/messages',
  verifyToken,
  requireRole('admin'),
  getAllMessagesController
);

/**
 * GET /admin (route de test)
 */
router.get('/', verifyToken, requireRole('admin'), (req, res) => {
  res.json({
    ok: true,
    message: `Bienvenue admin ${req.user.username}`,
    data: { role: req.user.role }
  });
});

module.exports = router;
