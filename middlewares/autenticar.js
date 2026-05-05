const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

/**
 * /////////////////////////////////////////////////////////////
 * // MIDDLEWARE DE AUTENTICACIÓN JWT
 * /////////////////////////////////////////////////////////////
 */
const autenticarToken = async (req, res, next) => {
  try {
    // 🟢 obtenerEncabezadoAuth
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        mensaje: 'Acceso denegado. No se proporcionó un token.' 
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

    // Adjuntar el usuario a la petición
    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(403).json({ 
      mensaje: 'Token no válido o expirado.',
      error: error.message 
    });
  }
};

module.exports = autenticarToken;
