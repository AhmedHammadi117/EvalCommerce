// services/messageService.js
/**
 * Service pour gérer les opérations de messages en base de données
 * Responsible for: DB queries, validation d'existence, bulk inserts
 */
const db = require('../config/db');
const logger = require('../config/logger');

/**
 * Envoie un message à un utilisateur ou une squad
 * @param {number} idExpediteur - ID du gestionnaire qui envoie
 * @param {number} idDestinataire - ID du destinataire (optionnel si squad)
 * @param {string} titre - Titre du message
 * @param {string} contenu - Contenu du message
 * @param {string} squad - Nom de la squad (optionnel, si quad c'est envoi de masse)
 * @returns {object} Résultat de l'insertion (insertId pour 1 msg, insertedCount pour squad)
 * @throws {Error} Si expéditeur/destinataire/squad non trouvé
 */
const envoyerMessage = async (idExpediteur, idDestinataire, titre, contenu, squad = null) => {
  try {
    // Étape 1 : Vérifier que l'expéditeur existe (sécurité)
    const [expRows] = await db.execute('SELECT id FROM users WHERE id = ?', [idExpediteur]);
    if (!expRows || expRows.length === 0) {
      const err = new Error('Expéditeur introuvable');
      err.status = 400;
      logger.warn('Expéditeur introuvable: ' + idExpediteur);
      throw err;
    }

    // Étape 2 : Envoi à une squad entière (bulk insert)
    if (squad) {
      // Récupérer tous les users de cette squad (role = 'user')
      const [users] = await db.execute('SELECT id FROM users WHERE squad = ? AND role = ?', [squad, 'user']);
      if (!users || users.length === 0) {
        const err = new Error('Aucun destinataire trouvé pour cette squad');
        err.status = 404;
        throw err;
      }

      // Préparer les valeurs pour une insertion multiple
      const values = users.map(u => [idExpediteur, u.id, titre, contenu]);
      const sql = 'INSERT INTO MESSAGE (idExpediteur, idDestinataire, titre, contenu) VALUES ?';
      const [result] = await db.query(sql, [values]);
      logger.info(`Squad broadcast: squad=${squad} -> ${result.affectedRows} inserts`);
      return { insertedCount: result.affectedRows };
    }

    // Étape 3 : Envoi à un seul utilisateur
    const [destRows] = await db.execute('SELECT id FROM users WHERE id = ?', [idDestinataire]);
    if (!destRows || destRows.length === 0) {
      const err = new Error('Destinataire introuvable');
      err.status = 400;
      logger.warn('Destinataire introuvable: ' + idDestinataire);
      throw err;
    }

    // Insérer le message
    const sqlSingle = 'INSERT INTO MESSAGE (idExpediteur, idDestinataire, titre, contenu) VALUES (?, ?, ?, ?)';
    const [result] = await db.execute(sqlSingle, [idExpediteur, idDestinataire, titre, contenu]);
    logger.info(`Message unique inséré : insertId=${result.insertId}`);
    return result;
  } catch (err) {
    logger.error('Erreur envoyerMessage', err);
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
