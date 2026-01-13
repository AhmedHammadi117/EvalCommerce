

// Contrôleur messages : validation et délégation au service
const messageService = require('../services/messageService');
const { validateTitre, validateContenu, validateSquad, validateUserId } = require('../middleware/validation');
const logger = require('../config/logger');

/**
 * POST /api/message/send
 * Envoie un message à un utilisateur ou une squad
 * Authentification: Manager requis
 */
const envoyerMessageController = async (req, res) => {
  try {
    let { idDestinataire, titre, contenu, squad } = req.body;
    const idExpediteur = req.user.id;
    
    // Si squad='ALL', remplacer par la squad du manager connecté
    if (squad === 'ALL' && req.user.squad) {
      squad = req.user.squad;
    }

    // Validation : au moins un destinataire OU une squad est requis
    if (!idDestinataire && !squad) return res.status(400).json({ ok: false, message: 'Id destinataire ou squad requis' });
    // Validation du titre
    const titleValidation = validateTitre(titre);
    if (!titleValidation.valid) return res.status(400).json({ ok: false, message: titleValidation.error });
    // Validation du contenu
    const contentValidation = validateContenu(contenu);
    if (!contentValidation.valid) return res.status(400).json({ ok: false, message: contentValidation.error });
    // Validation squad si fournie
    if (squad) {
      const squadValidation = validateSquad(squad);
      if (!squadValidation.valid) return res.status(400).json({ ok: false, message: squadValidation.error });
    }
    // Validation destinataire si fourni
    if (idDestinataire) {
      const userIdValidation = validateUserId(idDestinataire);
      if (!userIdValidation.valid) return res.status(400).json({ ok: false, message: userIdValidation.error });
    }
    // Appel au service pour envoyer le message
    const result = await messageService.envoyerMessage(idExpediteur, idDestinataire, titre, contenu, squad);
    logger.info(`Message inséré avec succès: ${JSON.stringify(result)}`);

    const msg = squad ? `Message envoyé à la squad ${squad}` : 'Message envoyé avec succès';
    return res.status(201).json({ ok: true, message: msg, data: result });
  } catch (err) {
    logger.error('[envoyerMessage] Erreur', err);
    const status = err && err.status ? err.status : 500;
    const message = err && err.message ? err.message : 'Erreur serveur';
    return res.status(status).json({ ok: false, message });
  }
};;

/**
 * GET /api/message/
 * Récupère tous les messages reçus par l'utilisateur authentifié
 * Authentification: User requis
 */
const getMessagesController = async (req, res) => {
  try {
    const messages = await messageService.getMessagesUtilisateur(req.user.id);
    logger.debug('getMessagesUtilisateur', { userId: req.user.id, count: messages.length });
    return res.status(200).json({ ok: true, data: messages });
  } catch (err) {
    logger.error('[getMessages] Erreur', err);
    const status = err && err.status ? err.status : 500;
    const message = err && err.message ? err.message : 'Erreur serveur';
    return res.status(status).json({ ok: false, message });
  }
};

/**
 * PATCH /api/message/:idMessage/lu
 * Marque un message comme lu
 * Authentification: User requis
 * Sécurité: L'utilisateur ne peut marquer que ses propres messages comme lus
 */
const marquerLuController = async (req, res) => {
  try {
    const { idMessage } = req.params;
    const idUser = req.user.id;
    logger.info(`marquerLu message ${idMessage} par user ${idUser}`);
    
    await messageService.marquerLu(idMessage, idUser);
    return res.status(200).json({ ok: true, message: 'Message marqué comme lu' });
  } catch (err) {
    logger.error('[marquerLu] Erreur', err);
    const status = err && err.status ? err.status : 500;
    const message = err && err.message ? err.message : 'Erreur serveur';
    return res.status(status).json({ ok: false, message });
  }
};

module.exports = { envoyerMessageController, getMessagesController, marquerLuController };
