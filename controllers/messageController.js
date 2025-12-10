// controllers/messageController.js
const messageService = require('../services/messageService');

// Gestionnaire envoie un message
const envoyerMessageController = async (req, res) => {
  try {
    const { idDestinataire, titre, contenu, squad } = req.body;
    const idExpediteur = req.user.id;
    console.log('envoyermessageController called by user:', idExpediteur, 'body:', req.body);

    if (!idDestinataire && !squad) {
      return res.status(400).json({ ok: false, message: 'Id destinataire ou squad requis' });
    }

    const result = await messageService.envoyerMessage(idExpediteur, idDestinataire, titre, contenu, squad);
    console.log('envoyerMessageController DB result:', result);
    const msg = squad ? `Message envoyé à la squad ${squad}` : 'Message envoyé avec succès';
    return res.status(201).json({ ok: true, message: msg, data: result });
  } catch (err) {
    console.error(err);
    const status = err && err.status ? err.status : 500;
    const message = err && err.message ? err.message : 'Erreur serveur';
    return res.status(status).json({ ok: false, message });
  }
};

// Commercial récupère ses messages
const getMessagesController = async (req, res) => {
  try {
    const messages = await messageService.getMessagesUtilisateur(req.user.id);
    return res.status(200).json({ ok: true, data: messages });
  } catch (err) {
    console.error(err);
    const status = err && err.status ? err.status : 500;
    const message = err && err.message ? err.message : 'Erreur serveur';
    return res.status(status).json({ ok: false, message });
  }
};

// Commercial marque un message comme lu
const marquerLuController = async (req, res) => {
  try {
    const { idMessage } = req.params;
    const idUser = req.user.id;
    await messageService.marquerLu(idMessage, idUser);
    return res.status(200).json({ ok: true, message: 'Message marqué comme lu' });
  } catch (err) {
    console.error(err);
    const status = err && err.status ? err.status : 500;
    const message = err && err.message ? err.message : 'Erreur serveur';
    return res.status(status).json({ ok: false, message });
  }
};

module.exports = { envoyerMessageController, getMessagesController, marquerLuController };
