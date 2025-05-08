const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token requerido' });

  try {
    const decoded = jwt.verify(token, 'RIFLI_SECRET');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

const authorizeRole = (role) => {
    return (req, res, next) => {
      if (req.user?.role !== role) {
        return res.status(403).json({ message: 'Acceso denegado' });
      }
      next();
    };
  };
  
  module.exports = { authMiddleware, authorizeRole };