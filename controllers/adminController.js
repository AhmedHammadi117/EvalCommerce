// filepath: controllers/adminController.js
/**
 * Contrôleur pour les opérations administrateur
 * Gestion des utilisateurs et statistiques
 */
const adminService = require('../services/adminService');

// ========== USERS MANAGEMENT ==========

const getAllUsersController = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();
    return res.status(200).json({
      ok: true,
      data: users
    });
  } catch (err) {
    console.error('❌ [getAllUsers] Erreur:', err.message);
    return res.status(500).json({
      ok: false,
      message: 'Erreur serveur interne'
    });
  }
};

const getUserByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await adminService.getUserById(id);
    return res.status(200).json({
      ok: true,
      data: user
    });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({
      ok: false,
      message: err.message || 'Erreur serveur'
    });
  }
};

const createUserController = async (req, res) => {
  try {
    const { username, password, role, squad } = req.body;

    // Validation
    if (!username || !password || !role) {
      return res.status(400).json({
        ok: false,
        message: 'Champs manquants: username, password, role requis'
      });
    }

    if (!['admin', 'manager', 'user'].includes(role)) {
      return res.status(400).json({
        ok: false,
        message: 'Rôle invalide. Valeurs: admin, manager, user'
      });
    }

    const newUser = await adminService.createUser(username, password, role, squad);
    return res.status(201).json({
      ok: true,
      message: 'Utilisateur créé avec succès',
      data: newUser
    });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({
      ok: false,
      message: err.message || 'Erreur serveur'
    });
  }
};

const updateUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, role, squad } = req.body;

    if (!username || !role) {
      return res.status(400).json({
        ok: false,
        message: 'Champs manquants: username, role requis'
      });
    }

    const updated = await adminService.updateUser(id, username, role, squad);
    return res.status(200).json({
      ok: true,
      message: 'Utilisateur modifié avec succès',
      data: updated
    });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({
      ok: false,
      message: err.message || 'Erreur serveur'
    });
  }
};

const deleteUserController = async (req, res) => {
  try {
    const { id } = req.params;
    await adminService.deleteUser(id);
    return res.status(200).json({
      ok: true,
      message: 'Utilisateur supprimé avec succès'
    });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({
      ok: false,
      message: err.message || 'Erreur serveur'
    });
  }
};

// ========== STATISTICS ==========

const getStatsController = async (req, res) => {
  try {
    const dashboard = await adminService.getDashboardData();
    return res.status(200).json({
      ok: true,
      data: dashboard
    });
  } catch (err) {
    console.error('❌ [getStats] Erreur:', err.message);
    return res.status(500).json({
      ok: false,
      message: 'Erreur serveur interne'
    });
  }
};

const getSalesStatsController = async (req, res) => {
  try {
    const stats = await adminService.getSalesStats();
    return res.status(200).json({
      ok: true,
      data: stats
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: 'Erreur serveur interne'
    });
  }
};

const getSalesPerUserController = async (req, res) => {
  try {
    const stats = await adminService.getSalesPerUser();
    return res.status(200).json({
      ok: true,
      data: stats
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: 'Erreur serveur interne'
    });
  }
};

const getProductStatsController = async (req, res) => {
  try {
    const stats = await adminService.getProductStats();
    return res.status(200).json({
      ok: true,
      data: stats
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: 'Erreur serveur interne'
    });
  }
};

const getMessageStatsController = async (req, res) => {
  try {
    const stats = await adminService.getMessageStats();
    return res.status(200).json({
      ok: true,
      data: stats
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: 'Erreur serveur interne'
    });
  }
};

const getSquadStatsController = async (req, res) => {
  try {
    const stats = await adminService.getSquadStats();
    return res.status(200).json({
      ok: true,
      data: stats
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: 'Erreur serveur interne'
    });
  }
};

module.exports = {
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
  getSquadStatsController
};
