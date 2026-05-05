const { Usuario } = require('../models');
const jwt = require('jsonwebtoken');

/**
 * /////////////////////////////////////////////////////////////
 * // CONTROLADOR DE AUTENTICACIÓN (LOGIN Y REGISTRO)
 * /////////////////////////////////////////////////////////////
 */

// 🟢 registrarUsuario
const registrar = async (req, res) => {
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

// 🟢 iniciarSesion
const login = async (req, res) => {
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
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error en el proceso de login',
      error: error.message
    });
  }
};

module.exports = {
  registrar,
  login
};
