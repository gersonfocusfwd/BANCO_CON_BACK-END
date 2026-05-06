const { Usuario } = require('../models');
const jwt = require('jsonwebtoken');

/**
 * /////////////////////////////////////////////////////////////
 * // CONTROLADOR DE AUTENTICACIÓN (LOGIN Y REGISTRO)
 * /////////////////////////////////////////////////////////////
 */

// 🟢 registrar_usuario_nuevo
const registrar_usuario_nuevo = async (req, res) => {
  try {
    const { nombre, email, cedula, password } = req.body;

    // 🟢 verificarExistenciaUsuario
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El correo electrónico ya está registrado.' });
    }

    // 🟢 crearNuevoUsuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      cedula,
      password
    });

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email
      }
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al registrar el usuario',
      error: error.message
    });
  }
};

// 🟢 iniciar_sesion
const iniciar_sesion = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🟢 buscarUsuarioPorEmail
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    // 🟢 validarCredenciales
    const esPasswordValido = await usuario.validarPassword(password);
    if (!esPasswordValido) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta.' });
    }

    // 🟢 generarTokenJWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // 🟢 enviarTokenEnCookie (Seguridad mejorada)
    res.cookie('token', token, {
      httpOnly: true, // Protege contra XSS
      secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
      sameSite: 'lax', // Protege contra CSRF
      maxAge: 8 * 60 * 60 * 1000 // 8 horas
    });

    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error en el proceso de login',
      error: error.message
    });
  }
};

// 🟢 obtenerPerfil
const perfil = async (req, res) => {
  res.status(200).json({
    usuario: {
      id: req.usuario.id,
      nombre: req.usuario.nombre,
      email: req.usuario.email,
      rol: req.usuario.rol
    }
  });
};

// 🟢 cerrar_sesion
const cerrar_sesion = async (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ mensaje: 'Sesión cerrada exitosamente' });
};

module.exports = {
  registrar_usuario_nuevo,
  iniciar_sesion,
  cerrar_sesion,
  perfil
};
