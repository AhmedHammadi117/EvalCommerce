// Validation helpers: titre/contenu/équipe/id (retournent {valid, error?})
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
 * Valide une équipe (accepte n'importe quelle string non vide)
 * @param {string} squad - Le nom de l'équipe à valider
 * @returns {object} { valid: boolean, error?: string }
 */
const validateSquad = (squad) => {
  if (!squad || typeof squad !== 'string' || !squad.trim()) {
    return { valid: false, error: 'Équipe requise' };
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

/**
 * Valide une date de naissance (âge entre 18 et 75 ans)
 * @param {string} dateNaissance - La date de naissance au format ISO
 * @returns {object} { valid: boolean, error?: string }
 */
const validateDateNaissance = (dateNaissance) => {
  if (!dateNaissance) {
    return { valid: false, error: 'Date de naissance requise' };
  }

  const birthDate = new Date(dateNaissance);
  const today = new Date();

  // Vérifier que la date est valide
  if (isNaN(birthDate.getTime())) {
    return { valid: false, error: 'Date de naissance invalide' };
  }

  // Calculer l'âge
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 18) {
    return { valid: false, error: 'L\'utilisateur doit avoir au moins 18 ans' };
  }
  if (age > 75) {
    return { valid: false, error: 'L\'utilisateur ne peut pas avoir plus de 75 ans' };
  }

  return { valid: true };
};

module.exports = {
  validateTitre,
  validateContenu,
  validateSquad,
  validateUserId,
  validateDateNaissance
};
