const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

/**
 * /////////////////////////////////////////////////////////////
 * // MIDDLEWARE DE AUTENTICACIÓN JWT
 * /////////////////////////////////////////////////////////////
 */
const autenticarToken = async (req, res, next) => {
  try {
    // 🟢 obtenerTokenDeCookies (Seguridad mejorada)
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ 
        mensaje: 'Acceso denegado. No hay una sesión activa.' 
      });
    }

    // 🟢 verificarTokenJWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 🟢 buscarUsuarioEnSesion
    const usuario = await Usuario.findByPk(decoded.id);

    if (!usuario) {
      return res.status(401).json({ 
        mensaje: 'Token no válido. El usuario ya no existe.' 
      });
    }

    // Adjuntar el usuario y su rol a la petición
    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(403).json({ 
      mensaje: 'Sesión expirada o no válida.',
      error: error.message 
    });
  }
};

/**
 * Middleware para verificar si el usuario es Administrador
 */
const esAdministrador = (req, res, next) => {
  if (req.usuario && req.usuario.rol === 'admin') {
    next();
  } else {
    return res.status(403).json({ 
      mensaje: 'Acceso restringido. Se requieren permisos de administrador.' 
    });
  }
};

module.exports = {
  autenticarToken,
  esAdministrador
};

