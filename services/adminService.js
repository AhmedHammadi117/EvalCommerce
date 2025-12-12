// AdminService: accès DB pour users + génération des statistiques (utilisé par controllers)
/**
 * Service administrateur pour gérer les utilisateurs et statistiques
 * Requiert le rôle admin pour tous les endpoints
 */
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// ========== USERS MANAGEMENT ==========

/**
 * Récupère tous les utilisateurs (sauf les mots de passe)
 */
const getAllUsers = async () => {
  const sql = 'SELECT id, username, role, squad, created_at FROM users ORDER BY created_at DESC';
  const [rows] = await db.execute(sql);
  return rows;
};

/**
 * Récupère un utilisateur spécifique par ID
 */
const getUserById = async (id) => {
  const sql = 'SELECT id, username, role, squad, created_at FROM users WHERE id = ?';
  const [rows] = await db.execute(sql, [id]);
  if (!rows || rows.length === 0) {
    const err = new Error('Utilisateur non trouvé');
    err.status = 404;
    throw err;
  }
  return rows[0];
};

/**
 * Crée un nouvel utilisateur
 */
const createUser = async (username, password, role, squad = null) => {
  // Vérifier unicité du username
  const [existing] = await db.execute('SELECT id FROM users WHERE username = ?', [username]);
  if (existing && existing.length > 0) {
    const err = new Error('Ce nom d\'utilisateur existe déjà');
    err.status = 400;
    throw err;
  }

  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insérer l'utilisateur
  const sql = 'INSERT INTO users (username, password, role, squad) VALUES (?, ?, ?, ?)';
  const [result] = await db.execute(sql, [username, hashedPassword, role, squad]);

  return {
    id: result.insertId,
    username,
    role,
    squad
  };
};

/**
 * Modifie un utilisateur existant
 */
const updateUser = async (id, username, role, squad = null) => {
  // Vérifier que l'utilisateur existe
  const [existing] = await db.execute('SELECT id FROM users WHERE id = ?', [id]);
  if (!existing || existing.length === 0) {
    const err = new Error('Utilisateur non trouvé');
    err.status = 404;
    throw err;
  }

  // Si username change, vérifier l'unicité
  if (username) {
    const [userWithName] = await db.execute('SELECT id FROM users WHERE username = ? AND id != ?', [username, id]);
    if (userWithName && userWithName.length > 0) {
      const err = new Error('Ce nom d\'utilisateur est déjà pris');
      err.status = 400;
      throw err;
    }
  }

  // Mettre à jour
  const sql = 'UPDATE users SET username = ?, role = ?, squad = ? WHERE id = ?';
  const [result] = await db.execute(sql, [username, role, squad, id]);

  return { id, username, role, squad };
};

/**
 * Supprime un utilisateur
 */
const deleteUser = async (id) => {
  // Vérifier que l'utilisateur existe
  const [existing] = await db.execute('SELECT id FROM users WHERE id = ?', [id]);
  if (!existing || existing.length === 0) {
    const err = new Error('Utilisateur non trouvé');
    err.status = 404;
    throw err;
  }

  const sql = 'DELETE FROM users WHERE id = ?';
  const [result] = await db.execute(sql, [id]);

  return { affectedRows: result.affectedRows };
};

// ========== STATISTICS ==========

/**
 * Récupère les statistiques de ventes
 */
const getSalesStats = async () => {
  const sql = `
    SELECT 
      COUNT(*) as total_ventes,
      SUM(quantite) as quantite_totale,
      COUNT(DISTINCT id_user) as vendeurs_actifs,
      AVG(quantite) as quantite_moyenne,
      MIN(date_vente) as premiere_vente,
      MAX(date_vente) as derniere_vente
    FROM vente
  `;
  const [rows] = await db.execute(sql);
  return rows[0] || {};
};

/**
 * Récupère les statistiques par vendeur
 */
const getSalesPerUser = async () => {
  const sql = `
    SELECT 
      u.id,
      u.username,
      u.squad,
      COUNT(v.id_vente) as nombre_ventes,
      SUM(v.quantite) as quantite_totale,
      AVG(v.quantite) as quantite_moyenne
    FROM users u
    LEFT JOIN vente v ON u.id = v.id_user
    WHERE u.role = 'user'
    GROUP BY u.id, u.username, u.squad
    ORDER BY nombre_ventes DESC
  `;
  const [rows] = await db.execute(sql);
  return rows;
};

/**
 * Récupère les statistiques de produits (plus vendus)
 */
const getProductStats = async () => {
  const sql = `
    SELECT 
      id_produit,
      COUNT(*) as fois_vendu,
      SUM(quantite) as quantite_totale,
      AVG(quantite) as quantite_moyenne
    FROM vente
    GROUP BY id_produit
    ORDER BY quantite_totale DESC
    LIMIT 20
  `;
  const [rows] = await db.execute(sql);
  return rows;
};

/**
 * Récupère les statistiques de messages
 */
const getMessageStats = async () => {
  const sql = `
    SELECT 
      COUNT(*) as total_messages,
      COUNT(DISTINCT idExpediteur) as expediteurs,
      COUNT(DISTINCT idDestinataire) as destinataires,
      SUM(CASE WHEN lu = 1 THEN 1 ELSE 0 END) as messages_lus,
      SUM(CASE WHEN lu = 0 THEN 1 ELSE 0 END) as messages_non_lus,
      MIN(dateEnvoi) as premier_message,
      MAX(dateEnvoi) as dernier_message
    FROM MESSAGE
  `;
  const [rows] = await db.execute(sql);
  return rows[0] || {};
};

/**
 * Récupère les statistiques par squad
 */
const getSquadStats = async () => {
  const sql = `
    SELECT 
      u.squad,
      COUNT(u.id) as nombre_utilisateurs,
      SUM(CASE WHEN u.role = 'manager' THEN 1 ELSE 0 END) as managers,
      SUM(CASE WHEN u.role = 'user' THEN 1 ELSE 0 END) as utilisateurs,
      SUM(v.quantite) as ventes_totales,
      COUNT(DISTINCT v.id_vente) as nombre_ventes
    FROM users u
    LEFT JOIN vente v ON u.id = v.id_user
    WHERE u.squad IS NOT NULL
    GROUP BY u.squad
    ORDER BY u.squad
  `;
  const [rows] = await db.execute(sql);
  return rows;
};

/**
 * Récupère un tableau de bord complet avec toutes les stats
 */
const getDashboardData = async () => {
  const [salesStats, salesPerUser, productStats, messageStats, squadStats, allUsers] = await Promise.all([
    getSalesStats(),
    getSalesPerUser(),
    getProductStats(),
    getMessageStats(),
    getSquadStats(),
    getAllUsers()
  ]);

  return {
    summary: {
      total_users: allUsers.length,
      total_sales: salesStats.total_ventes || 0,
      total_messages: messageStats.total_messages || 0,
      unread_messages: messageStats.messages_non_lus || 0
    },
    sales: salesStats,
    users: {
      by_user: salesPerUser,
      count: allUsers.length
    },
    products: productStats,
    messages: messageStats,
    squads: squadStats
  };
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getSalesStats,
  getSalesPerUser,
  getProductStats,
  getMessageStats,
  getSquadStats,
  getDashboardData
};
