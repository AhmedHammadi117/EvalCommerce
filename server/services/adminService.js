// Service admin : gestion utilisateurs & stats (requiert rôle admin)
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// ================== UTILISATEURS ==================

// Récupère tous les utilisateurs (hors mots de passe)
const getAllUsers = async () => {
  const [rows] = await db.execute(
    'SELECT id, username, role, squad, nom, prenom, date_naissance, created_at FROM users ORDER BY created_at DESC'
  );
  return rows;
};

// Récupère un utilisateur par ID
const getUserById = async (id) => {
  const [rows] = await db.execute(
    'SELECT id, username, role, squad, nom, prenom, date_naissance, created_at FROM users WHERE id = ?',
    [id]
  );
  if (!rows.length) throw Object.assign(new Error('Utilisateur non trouvé'), { status: 404 });
  return rows[0];
};

// Création d’un utilisateur
const createUser = async (
  username,
  password,
  role,
  squad = null,
  nom = '',
  prenom = '',
  date_naissance = null
) => {
  // Unicité username
  const [existing] = await db.execute(
    'SELECT id FROM users WHERE username = ?',
    [username]
  );
  if (existing.length) {
    throw Object.assign(new Error("Ce nom d'utilisateur existe déjà"), { status: 400 });
  }

  // ===== RÈGLE MÉTIER : 1 MANAGER PAR SQUAD =====
  if (role === 'manager') {
    if (!squad) {
      throw Object.assign(new Error('Un manager doit obligatoirement avoir une squad'), { status: 400 });
    }

    const [existingManager] = await db.execute(
      "SELECT id FROM users WHERE role = 'manager' AND squad = ? LIMIT 1",
      [squad]
    );

    if (existingManager.length) {
      throw Object.assign(
        new Error(`La squad ${squad} possède déjà un manager`),
        { status: 400 }
      );
    }
  }

  // Hash mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insertion
  const [result] = await db.execute(
    'INSERT INTO users (username, password, role, squad, nom, prenom, date_naissance) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [username, hashedPassword, role, squad, nom, prenom, date_naissance]
  );

  return { id: result.insertId, username, role, squad, nom, prenom, date_naissance };
};

// Modification d’un utilisateur
const updateUser = async (
  id,
  username,
  role,
  squad = null,
  nom = '',
  prenom = '',
  date_naissance = null
) => {
  // Vérifier existence
  const [existing] = await db.execute(
    'SELECT id FROM users WHERE id = ?',
    [id]
  );
  if (!existing.length) {
    throw Object.assign(new Error('Utilisateur non trouvé'), { status: 404 });
  }

  // Unicité username
  const [userWithSameName] = await db.execute(
    'SELECT id FROM users WHERE username = ? AND id != ?',
    [username, id]
  );
  if (userWithSameName.length) {
    throw Object.assign(new Error("Ce nom d'utilisateur est déjà pris"), { status: 400 });
  }

  // ===== RÈGLE MÉTIER : 1 MANAGER PAR SQUAD (UPDATE) =====
  if (role === 'manager') {
    if (!squad) {
      throw Object.assign(new Error('Un manager doit obligatoirement avoir une squad'), { status: 400 });
    }

    const [existingManager] = await db.execute(
      "SELECT id FROM users WHERE role = 'manager' AND squad = ? AND id != ? LIMIT 1",
      [squad, id]
    );

    if (existingManager.length) {
      throw Object.assign(
        new Error(`La squad ${squad} possède déjà un manager`),
        { status: 400 }
      );
    }
  }

  // Update
  await db.execute(
    'UPDATE users SET username = ?, role = ?, squad = ?, nom = ?, prenom = ?, date_naissance = ? WHERE id = ?',
    [username, role, squad, nom, prenom, date_naissance, id]
  );

  return { id, username, role, squad, nom, prenom, date_naissance };
};

// Suppression d’un utilisateur
const deleteUser = async (id) => {
  const [existing] = await db.execute(
    'SELECT id FROM users WHERE id = ?',
    [id]
  );
  if (!existing.length) {
    throw Object.assign(new Error('Utilisateur non trouvé'), { status: 404 });
  }

  // Supprimer messages liés
  await db.execute(
    'DELETE FROM message WHERE idExpediteur = ? OR idDestinataire = ?',
    [id, id]
  );

  // Supprimer utilisateur
  const [result] = await db.execute(
    'DELETE FROM users WHERE id = ?',
    [id]
  );

  return { affectedRows: result.affectedRows };
};

// ================== STATISTICS ==================

const getSalesStats = async () => {
  const [rows] = await db.execute(`
    SELECT 
      COUNT(*) as total_ventes,
      SUM(quantite) as quantite_totale,
      COUNT(DISTINCT id_user) as vendeurs_actifs
    FROM vente
  `);
  return rows[0] || {};
};

const getSalesPerUser = async () => {
  const [rows] = await db.execute(`
    SELECT 
      u.id,
      u.username,
      u.squad,
      COUNT(v.id_vente) as nombre_ventes,
      SUM(v.quantite) as quantite_totale
    FROM users u
    LEFT JOIN vente v ON u.id = v.id_user
    WHERE u.role = 'user'
    GROUP BY u.id, u.username, u.squad
  `);
  return rows;
};

const getMessageStats = async () => {
  const [rows] = await db.execute(`
    SELECT 
      COUNT(*) as total_messages,
      SUM(CASE WHEN lu = 0 THEN 1 ELSE 0 END) as messages_non_lus
    FROM MESSAGE
  `);
  return rows[0] || {};
};

const getSquadStats = async () => {
  const [rows] = await db.execute(`
    SELECT 
      squad,
      COUNT(*) as nombre_utilisateurs,
      SUM(CASE WHEN role = 'manager' THEN 1 ELSE 0 END) as managers
    FROM users
    WHERE squad IS NOT NULL
    GROUP BY squad
  `);
  return rows;
};

const getDashboardData = async () => {
  const [sales, users, messages, squads] = await Promise.all([
    getSalesStats(),
    getAllUsers(),
    getMessageStats(),
    getSquadStats()
  ]);

  return {
    summary: {
      total_users: users.length,
      total_sales: sales.total_ventes || 0,
      unread_messages: messages.messages_non_lus || 0
    },
    squads
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
  getMessageStats,
  getSquadStats,
  getDashboardData
};
