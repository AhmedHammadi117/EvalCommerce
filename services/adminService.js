// Service admin : gestion utilisateurs & stats (requiert rôle admin)
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// --- Utilisateurs ---
// Récupère tous les utilisateurs (hors mots de passe)
const getAllUsers = async () => {
  const [rows] = await db.execute('SELECT id, username, role, squad, nom, prenom, date_naissance, created_at FROM users ORDER BY created_at DESC');
  return rows;
};

// Récupère un utilisateur par ID
const getUserById = async (id) => {
  const [rows] = await db.execute('SELECT id, username, role, squad, nom, prenom, date_naissance, created_at FROM users WHERE id = ?', [id]);
  if (!rows?.length) throw Object.assign(new Error('Utilisateur non trouvé'), { status: 404 });
  return rows[0];
};

// Crée un nouvel utilisateur (vérifie unicité, hash le mot de passe)
const createUser = async (username, password, role, squad = null, nom = '', prenom = '', date_naissance = null) => {
  const [existing] = await db.execute('SELECT id FROM users WHERE username = ?', [username]);
  if (existing?.length) throw Object.assign(new Error('Ce nom d\'utilisateur existe déjà'), { status: 400 });
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await db.execute(
    'INSERT INTO users (username, password, role, squad, nom, prenom, date_naissance) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [username, hashedPassword, role, squad, nom, prenom, date_naissance]
  );
  return { id: result.insertId, username, role, squad, nom, prenom, date_naissance };
}

/**
 * Modifie un utilisateur existant
 */
const updateUser = async (id, username, role, squad = null, nom = '', prenom = '', date_naissance = null) => {
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
  const sql = 'UPDATE users SET username = ?, role = ?, squad = ?, nom = ?, prenom = ?, date_naissance = ? WHERE id = ?';
  const [result] = await db.execute(sql, [username, role, squad, nom, prenom, date_naissance, id]);

  return { id, username, role, squad, nom, prenom, date_naissance };
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

  // Supprimer tous les messages où il est expéditeur ou destinataire
  await db.execute('DELETE FROM message WHERE idExpediteur = ? OR idDestinataire = ?', [id, id]);

  // Supprimer l'utilisateur (les ventes restent)
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
      COALESCE(SUM(v.quantite), 0) as quantite_totale,
      COALESCE(AVG(v.quantite), 0) as quantite_moyenne
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
 * Récupère les statistiques par équipe
 */
const getSquadStats = async () => {
  const sql = `
    SELECT 
      u.squad,
      COUNT(DISTINCT u.id) as nombre_utilisateurs,
      SUM(CASE WHEN u.role = 'manager' THEN 1 ELSE 0 END) as managers,
      SUM(CASE WHEN u.role = 'user' THEN 1 ELSE 0 END) as utilisateurs,
      COALESCE(SUM(v.quantite), 0) as quantite_totale,
      COUNT(v.id_vente) as nombre_ventes
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

/**
 * Récupère toutes les ventes avec détails utilisateur
 */
const getAllVentes = async () => {
  const sql = `
    SELECT 
      v.id_vente,
      v.id_user,
      u.username,
      u.squad,
      v.id_produit,
      v.quantite,
      v.adresse,
      v.date_vente
    FROM vente v
    LEFT JOIN users u ON v.id_user = u.id
    ORDER BY v.date_vente DESC
  `;
  const [rows] = await db.execute(sql);
  return rows;
};

/**
 * Récupère tous les messages avec détails expéditeur et destinataire
 */
const getAllMessages = async () => {
  const sql = `
    SELECT 
      m.idMessage,
      m.titre,
      m.contenu,
      m.dateEnvoi,
      m.lu,
      m.idExpediteur,
      exp.username as expediteur_username,
      m.idDestinataire,
      dest.username as destinataire_username
    FROM MESSAGE m
    LEFT JOIN users exp ON m.idExpediteur = exp.id
    LEFT JOIN users dest ON m.idDestinataire = dest.id
    ORDER BY m.dateEnvoi DESC
  `;
  const [rows] = await db.execute(sql);
  return rows;
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
  getDashboardData,
  getAllVentes,
  getAllMessages
};