


const jwt = require('jsonwebtoken');
require('dotenv').config();
//const SECRET = 'secret123';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Aucun token fourni' });

  const token = authHeader.split(' ')[1] ;
  jwt.verify(token,process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token invalide ou expiré' });
    req.user = decoded; // { id, username, role, squad, iat, exp }
    next();
  });
};



// middleware pour vérifier rôle
const requireRole = (role) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Non authentifié' });
  if (req.user.role !== role) return res.status(403).json({ message: 'Accès refusé' });
  next();
};





module.exports = {verifyToken, requireRole}   ;