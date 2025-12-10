// routes/message.js
const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const {
  envoyerMessageController,
  getMessagesController,
  marquerLuController
} = require('../controllers/messageController');

// Gestionnaire envoie un message à un commercial
router.post('/send', verifyToken, requireRole('manager'), (req, res, next) => {
  console.log('Route /send appelée');
  next();
}, envoyerMessageController);

// Commercial récupère ses messages
router.get('/', verifyToken, requireRole('user'), getMessagesController);

// Commercial marque message comme lu
router.patch('/:idMessage/lu', verifyToken, requireRole('user'), marquerLuController);


module.exports = router;
