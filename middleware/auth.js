


// Middleware d'auth: vérifie JWT puis `req.user` contient {id, username, role, squad}
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware d'authentification JWT
 * Vérifie que le token est présent et valide
 * Si valide, remplit req.user avec les données du token
 * 
 * @param {object} req - Requête Express
 * @param {object} res - Réponse Express
 * @param {function} next - Middleware suivant
 */
const verifyToken = (req, res, next) => {
  // Récupérer l'en-tête Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Aucun token fourni' });
  }

  // Extraire le token du format "Bearer <token>"
  const token = authHeader.split(' ')[1];
  
  // Vérifier la validité du token avec la clé secrète
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.warn('⚠️  [JWT] Token invalide:', err.message);
      return res.status(401).json({ message: 'Token invalide ou expiré' });
    }
    
    // Remplir req.user avec les données du token
    // Contient: { id, username, role, squad, iat, exp }
    req.user = decoded;
    next();
  });
};

/**
 * Middleware de vérification du rôle
 * À utiliser APRÈS verifyToken
 * Vérifie que l'utilisateur a le rôle requis
 * 
 * @param {string} role - Rôle requis (admin, manager, user)
 * @returns {function} Middleware Express
 * 
 * Exemple: requireRole('manager')
 */
const requireRole = (role) => (req, res, next) => {
  // Vérifier que req.user a été défini par verifyToken
  if (!req.user) {
    return res.status(401).json({ message: 'Non authentifié' });
  }
  
  // Vérifier que le rôle correspond
  if (req.user.role !== role) {
    console.warn(`⚠️  [AUTH] Accès refusé: role=${req.user.role}, requis=${role}`);
    return res.status(403).json({ message: 'Accès refusé' });
  }
  
  // Rôle valide, continuer
  next();
};


module.exports = {verifyToken, requireRole}   ;