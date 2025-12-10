// services/messageService.js
const db = require('../config/db');

const envoyerMessage = async (idExpediteur, idDestinataire, titre, contenu, squad = null) => {
  // Vérifier que l'expéditeur existe
  try {
    const [expRows] = await db.execute('SELECT id FROM users WHERE id = ?', [idExpediteur]);
    if (!expRows || expRows.length === 0) {
      const err = new Error('Expéditeur introuvable');
      err.status = 400;
      throw err;
    }

    // Si la cible est une squad, récupérer les destinataires et insérer en batch
    if (squad) {
      const [users] = await db.execute('SELECT id FROM users WHERE squad = ? AND role = ?', [squad, 'user']);
      if (!users || users.length === 0) {
        const err = new Error('Aucun destinataire trouvé pour cette squad');
        err.status = 404;
        throw err;
      }

      // Construire valeurs pour insertion multiple
      const values = users.map(u => [idExpediteur, u.id, titre, contenu]);
      // Utiliser query pour l'insertion multiple
      const sql = 'INSERT INTO MESSAGE (idExpediteur, idDestinataire, titre, contenu) VALUES ?';
      const [result] = await db.query(sql, [values]);
      console.log(`Message inséré pour squad=${squad} -> affectedRows=${result.affectedRows}`);
      return { insertedCount: result.affectedRows };
    }

    // Sinon, comportement classique pour un seul destinataire
    // Vérifier que le destinataire existe dans la base de données
    const [destRows] = await db.execute('SELECT id FROM users WHERE id = ?', [idDestinataire]);
    if (!destRows || destRows.length === 0) {
      const err = new Error('Destinataire introuvable');
      err.status = 400;
      throw err;
    }

    // Insérer le message dans la table MESSAGE
    const sqlSingle = 'INSERT INTO MESSAGE (idExpediteur, idDestinataire, titre, contenu) VALUES (?, ?, ?, ?)';
    const [result] = await db.execute(sqlSingle, [idExpediteur, idDestinataire, titre, contenu]);
    console.log('Message inséré avec succès:', result);
    return result;
  } catch (err) {
    console.error('Erreur insertion MESSAGE:', err.message || err);
    throw err;
  }
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
