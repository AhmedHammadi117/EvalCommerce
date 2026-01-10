// Constantes partagées: rôles, squads, messages d'erreur et validations
// Centralisation des constantes et valeurs fixes du projet

module.exports = {
  // Rôles utilisateur
  ROLES: {
    ADMIN: 'admin',
    MANAGER: 'manager',
    USER: 'user'
  },

  // Squads disponibles
  SQUADS: ['A', 'B', 'C', 'D'],

  // Messages d'erreur standardisés
  ERRORS: {
    INVALID_CREDENTIALS: 'Identifiant ou mot de passe invalide',
    TOKEN_MISSING: 'Aucun token fourni',
    TOKEN_INVALID: 'Token invalide ou expiré',
    NOT_AUTHENTICATED: 'Non authentifié',
    ACCESS_DENIED: 'Accès refusé',
    USER_NOT_FOUND: 'Utilisateur introuvable',
    RECIPIENT_NOT_FOUND: 'Destinataire introuvable',
    SQUAD_NO_RECIPIENTS: 'Aucun destinataire trouvé pour cette squad',
    MESSAGE_NOT_FOUND: 'Message introuvable ou accès refusé',
    MISSING_FIELDS: 'Champs manquants',
    INVALID_INPUT: 'Entrée invalide',
    SERVER_ERROR: 'Erreur serveur interne'
  },

  // Validation
  VALIDATION: {
    TITLE_MIN_LENGTH: 3,
    TITLE_MAX_LENGTH: 100,
    CONTENT_MIN_LENGTH: 5,
    CONTENT_MAX_LENGTH: 5000,
    USERNAME_MIN_LENGTH: 3,
    PASSWORD_MIN_LENGTH: 4
  },

  // JWT
  JWT: {
    EXPIRES_IN: '1h',
    ALGORITHM: 'HS256'
  }
};
