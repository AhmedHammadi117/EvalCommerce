// filepath: config/logger.js
/**
 * Logger centralisé avec formatage consistant
 * Utilise des emojis pour la lisibilité et codes de couleur
 */

const logger = {
  /**
   * Info: opération réussie
   */
  info: (message) => {
    console.log(`✅ [INFO] ${message}`);
  },

  /**
   * Avertissement: opération suspecte mais pas critique
   */
  warn: (message) => {
    console.warn(`⚠️  [WARN] ${message}`);
  },

  /**
   * Erreur: quelque chose a échoué
   */
  error: (message, error = null) => {
    console.error(`❌ [ERROR] ${message}`, error ? error.message : '');
  },

  /**
   * Debug: informations de débogage pour développement
   */
  debug: (message, data = null) => {
    if (process.env.DEBUG === 'true') {
      console.log(`🐛 [DEBUG] ${message}`, data ? data : '');
    }
  },

  /**
   * Opération d'envoi de message
   */
  sendMessage: (from, to, title) => {
    console.log(`📤 [MESSAGE] De: ${from} -> À: ${to} | Titre: ${title}`);
  },

  /**
   * Opération de lecture de message
   */
  readMessage: (messageId, userId) => {
    console.log(`📖 [READ] Message #${messageId} lu par user ${userId}`);
  },

  /**
   * Opération de vente
   */
  recordSale: (userId, productId, quantity) => {
    console.log(`💰 [SALE] User ${userId} | Product: ${productId} | Qty: ${quantity}`);
  },

  /**
   * Accès refusé
   */
  accessDenied: (userId, resource, reason) => {
    console.warn(`🔒 [DENIED] User ${userId} accès refusé à ${resource} (${reason})`);
  },

  /**
   * Authentification
   */
  auth: (username, result) => {
    if (result === 'success') {
      console.log(`🔐 [AUTH] ${username} connecté avec succès`);
    } else {
      console.warn(`🔐 [AUTH] ${username} tentative échouée: ${result}`);
    }
  },

  /**
   * Opération de base de données
   */
  db: (operation, table, rowsAffected) => {
    console.log(`💾 [DB] ${operation} ${table} | Rows: ${rowsAffected}`);
  }
};

module.exports = logger;
