const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

// Middleware para verificar token JWT
const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Acceso denegado. Token no proporcionado.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar que el usuario existe y está activo
    const [users] = await pool.execute(
      'SELECT id, email, nombre, apellido, rol, activo FROM usuarios WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0 || !users[0].activo) {
      return res.status(401).json({ 
        error: 'Token inválido o usuario inactivo.' 
      });
    }

    req.user = users[0];
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expirado.' 
      });
    }
    return res.status(401).json({ 
      error: 'Token inválido.' 
    });
  }
};

// Middleware para verificar roles
const verifyRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Usuario no autenticado.' 
      });
    }

    if (!allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({ 
        error: 'No tienes permisos para acceder a este recurso.' 
      });
    }

    next();
  };
};

// Middleware para verificar que el usuario puede acceder a sus propios datos
const verifyOwnership = (req, res, next) => {
  const userId = parseInt(req.params.id);
  
  if (req.user.id !== userId && req.user.rol !== 'profesional') {
    return res.status(403).json({ 
      error: 'No puedes acceder a datos de otros usuarios.' 
    });
  }
  
  next();
};

module.exports = {
  verifyToken,
  verifyRole,
  verifyOwnership
};