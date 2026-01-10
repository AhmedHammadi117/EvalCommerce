// Service messages : gestion DB, vérification, insertion (single/squad)
const db = require('../config/db');
const logger = require('../config/logger');

// Envoie un message à un utilisateur ou une squad
const envoyerMessage = async (idExpediteur, idDestinataire, titre, contenu, squad = null) => {
  // Vérifier que l'expéditeur existe
  const [expRows] = await db.execute('SELECT id FROM users WHERE id = ?', [idExpediteur]);
  if (!expRows?.length) throw Object.assign(new Error('Expéditeur introuvable'), { status: 400 });

  // Envoi à une squad entière (bulk insert)
  if (squad) {
    const [users] = await db.execute('SELECT id FROM users WHERE squad = ? AND role = ?', [squad, 'user']);
    if (!users?.length) throw Object.assign(new Error('Aucun destinataire trouvé pour cette squad'), { status: 404 });
    const values = users.map(u => [idExpediteur, u.id, titre, contenu]);
    const [result] = await db.query('INSERT INTO MESSAGE (idExpediteur, idDestinataire, titre, contenu) VALUES ?', [values]);
    logger.info(`Squad broadcast: squad=${squad} -> ${result.affectedRows} inserts`);
    return { insertedCount: result.affectedRows };
  }

  // Envoi à un seul utilisateur
  const [destRows] = await db.execute('SELECT id FROM users WHERE id = ?', [idDestinataire]);
  if (!destRows?.length) throw Object.assign(new Error('Destinataire introuvable'), { status: 400 });
  const [result] = await db.execute('INSERT INTO MESSAGE (idExpediteur, idDestinataire, titre, contenu) VALUES (?, ?, ?, ?)', [idExpediteur, idDestinataire, titre, contenu]);
  logger.info(`Message unique inséré : insertId=${result.insertId}`);
  return { insertId: result.insertId };
};

// Récupérer les messages d’un utilisateur
const getMessagesUtilisateur = async (id) => {
  const sql = `
    SELECT idMessage, titre, contenu, dateEnvoi, lu, idExpediteur 
    FROM MESSAGE 
    WHERE idDestinataire = ?
    ORDER BY dateEnvoi DESC
  `;
  const [rows] = await db.execute(sql, [id]);
  return rows;
};

// Marquer un message comme lu
const marquerLu = async (idMessage, idDestinataire) => {
  // On vérifie que le message appartient bien au destinataire
  const sql = 'UPDATE MESSAGE SET lu = TRUE WHERE idMessage = ? AND idDestinataire = ?';
  const [result] = await db.execute(sql, [idMessage, idDestinataire]);
  if (!result || result.affectedRows === 0) {
    const err = new Error('Message introuvable ou accès refusé');
    err.status = 404;
    throw err;
  }
  return result;
};

module.exports = { envoyerMessage, getMessagesUtilisateur, marquerLu };
