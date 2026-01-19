// Contrôleur admin : gestion utilisateurs et stats (oriente vers adminService)
const adminService = require('../services/adminService');
const { validateDateNaissance } = require('../middleware/validation');

const getAllUsersController = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();
    return res.status(200).json({
      ok: true,
      data: users
    });
  } catch (err) {
    // Erreur serveur lors de la récupération des utilisateurs
    return res.status(500).json({ ok: false, message: 'Erreur serveur interne' });
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
    const { username, password, role, squad, nom, prenom, date_naissance } = req.body;

    // Validation des champs obligatoires
    if (!username || !password || !role) {
      return res.status(400).json({ ok: false, message: 'Champs manquants: username, password, role requis' });
    }
    if (!['admin', 'manager', 'user'].includes(role)) {
      return res.status(400).json({ ok: false, message: 'Rôle invalide. Valeurs: admin, manager, user' });
    }

    // Validation de la date de naissance
    if (date_naissance) {
      const dateValidation = validateDateNaissance(date_naissance);
      if (!dateValidation.valid) {
        return res.status(400).json({ ok: false, message: dateValidation.error });
      }
    }

    const newUser = await adminService.createUser(username, password, role, squad, nom, prenom, date_naissance);
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
    const { username, role, squad, nom, prenom, date_naissance } = req.body;

    if (!username || !role) {
      return res.status(400).json({
        ok: false,
        message: 'Champs manquants: username, role requis'
      });
    }

    // Validation de la date de naissance
    if (date_naissance) {
      const dateValidation = validateDateNaissance(date_naissance);
      if (!dateValidation.valid) {
        return res.status(400).json({ ok: false, message: dateValidation.error });
      }
    }

    const updated = await adminService.updateUser(id, username, role, squad, nom, prenom, date_naissance);
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
    const logger = require('../config/logger');
    logger.error('[getStats] Erreur', err);
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

const getAllVentesController = async (req, res) => {
  try {
    const ventes = await adminService.getAllVentes();
    return res.status(200).json({
      ok: true,
      data: ventes
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: 'Erreur serveur interne'
    });
  }
};

const getAllMessagesController = async (req, res) => {
  try {
    const messages = await adminService.getAllMessages();
    return res.status(200).json({
      ok: true,
      data: messages
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
  getSquadStatsController,
  getAllVentesController,
  getAllMessagesController
};
