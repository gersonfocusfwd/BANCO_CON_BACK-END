const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

/**
 * /////////////////////////////////////////////////////////////
 * // MIDDLEWARE DE AUTENTICACIÓN JWT
 * /////////////////////////////////////////////////////////////
 */
const verificar_token = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ 
        mensaje: 'Acceso denegado. No hay una sesión activa.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findByPk(decoded.id, {
      include: [
        { model: require('../models').Cuenta, as: 'cuentas' },
        { model: require('../models').Tarjeta, as: 'tarjetas' }
      ]
    });


    if (!usuario) {
      return res.status(401).json({ 
        mensaje: 'Token no válido. El usuario ya no existe.' 
      });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(403).json({ 
      mensaje: 'Sesión expirada o no válida.',
      error: error.message 
    });
  }
};

const verificar_rol_admin = (req, res, next) => {
  if (req.usuario && (req.usuario.rol === 'admin' || req.usuario.rol === 'superadmin')) {
    next();
  } else {
    return res.status(403).json({ 
      mensaje: 'Acceso restringido. Se requieren permisos de administrador.' 
    });
  }
};

module.exports = {
  verificar_token,
  verificar_rol_admin
};

