const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Vérifie si l'utilisateur est admin
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Accès refusé : admin uniquement' });
    }

    // Tout est ok, on continue uu
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token invalide' });
  }
};
