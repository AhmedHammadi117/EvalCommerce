// middleware/validation.js
// Fonctions de validation des données entrantes

const CONSTANTS = require('../config/constants');

/**
 * Valide un titre de message
 * @param {string} titre - Le titre à valider
 * @returns {object} { valid: boolean, error?: string }
 */
const validateTitre = (titre) => {
  if (!titre || typeof titre !== 'string') {
    return { valid: false, error: 'Titre requis' };
  }
  if (titre.trim().length < CONSTANTS.VALIDATION.TITLE_MIN_LENGTH) {
    return { valid: false, error: `Titre trop court (min ${CONSTANTS.VALIDATION.TITLE_MIN_LENGTH} caractères)` };
  }
  if (titre.length > CONSTANTS.VALIDATION.TITLE_MAX_LENGTH) {
    return { valid: false, error: `Titre trop long (max ${CONSTANTS.VALIDATION.TITLE_MAX_LENGTH} caractères)` };
  }
  return { valid: true };
};

/**
 * Valide le contenu d'un message
 * @param {string} contenu - Le contenu à valider
 * @returns {object} { valid: boolean, error?: string }
 */
const validateContenu = (contenu) => {
  if (!contenu || typeof contenu !== 'string') {
    return { valid: false, error: 'Contenu requis' };
  }
  if (contenu.trim().length < CONSTANTS.VALIDATION.CONTENT_MIN_LENGTH) {
    return { valid: false, error: `Contenu trop court (min ${CONSTANTS.VALIDATION.CONTENT_MIN_LENGTH} caractères)` };
  }
  if (contenu.length > CONSTANTS.VALIDATION.CONTENT_MAX_LENGTH) {
    return { valid: false, error: `Contenu trop long (max ${CONSTANTS.VALIDATION.CONTENT_MAX_LENGTH} caractères)` };
  }
  return { valid: true };
};

/**
 * Valide une squad
 * @param {string} squad - Le nom de la squad à valider
 * @returns {object} { valid: boolean, error?: string }
 */
const validateSquad = (squad) => {
  if (!squad || typeof squad !== 'string') {
    return { valid: false, error: 'Squad requise' };
  }
  if (!CONSTANTS.SQUADS.includes(squad.toUpperCase())) {
    return { valid: false, error: `Squad invalide. Valeurs autorisées: ${CONSTANTS.SQUADS.join(', ')}` };
  }
  return { valid: true };
};

/**
 * Valide un ID destinataire (doit être un nombre positif)
 * @param {*} id - L'ID à valider
 * @returns {object} { valid: boolean, error?: string }
 */
const validateUserId = (id) => {
  const parsed = parseInt(id, 10);
  if (isNaN(parsed) || parsed <= 0) {
    return { valid: false, error: 'ID utilisateur invalide' };
  }
  return { valid: true };
};

module.exports = {
  validateTitre,
  validateContenu,
  validateSquad,
  validateUserId
};
