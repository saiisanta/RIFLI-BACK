import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  // Leer de cookie en vez de Authorization header
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido o expirado' });
    }
    req.user = user; // { id, role }
    next();
  });
};

export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'No tenés permisos para acceder a este recurso' 
      });
    }

    next();
  };
};