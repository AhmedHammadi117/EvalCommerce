// routes/message.js
/**
 * Routes pour la gestion des messages
 * Tous les endpoints sont protégés par JWT
 * Les rôles sont vérifiés: manager pour envoyer, user pour recevoir
 */
// Routes sous /api/message — envoi (manager) et lecture (user)
const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const {
  envoyerMessageController,
  getMessagesController,
  marquerLuController
} = require('../controllers/messageController');

/**
 * POST /api/message/send
 * Envoie un message à un utilisateur ou une squad
 * Authentification: Oui (JWT)
 * Rôle requis: manager
 * 
 * Body:
 * {
 *   "idDestinataire": 3,     // Optionnel si squad
 *   "squad": "A",            // Optionnel si idDestinataire
 *   "titre": "...",
 *   "contenu": "..."
 * }
 * 
 * Response: { ok, message, data }
 */
router.post('/send',
  verifyToken,                    // Vérifier le token JWT
  requireRole('manager'),         // Vérifier le rôle = manager
  (req, res, next) => {           // Log la requête
    const logger = require('../config/logger');
    logger.info(`[POST /send] Manager ID: ${req.user.id}`);
    next();
  },
  envoyerMessageController        // Traiter la requête
);

/**
 * GET /api/message/
 * Récupère tous les messages reçus par l'utilisateur
 * Authentification: Oui (JWT)
 * Rôle requis: user
 * 
 * Response: { ok, data: [messages] }
 */
router.get('/',
  verifyToken,                    // Vérifier le token JWT
  requireRole('user'),            // Vérifier le rôle = user
  getMessagesController           // Récupérer les messages
);

/**

 * PATCH /api/message/:idMessage/lu
 * Marque un message comme lu
 * Authentification: Oui (JWT)
 * Rôle requis: user
 * Sécurité: L'utilisateur ne peut marquer que SES messages
 * 
 * Paramètres d'URL:
 * - idMessage: ID du message
 * 
 * Response: { ok, message }
 */
router.patch('/:idMessage/lu',
  verifyToken,                    // Vérifier le token JWT
  requireRole('user'),            // Vérifier le rôle = user
  marquerLuController             // Marquer comme lu
);


module.exports = router;
