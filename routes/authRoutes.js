const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const { verificar_token } = require('../middlewares/autenticar');

/**
 * /////////////////////////////////////////////////////////////
 * // DEFINICIÓN DE RUTAS PARA AUTENTICACIÓN
 * /////////////////////////////////////////////////////////////
 */

// Ruta para registro de usuarios
router.post('/registro', authController.registrar_usuario_nuevo);

// Ruta para inicio de sesión
router.post('/login', authController.iniciar_sesion);

// Ruta para cerrar sesión
router.post('/logout', authController.cerrar_sesion);

// Ruta para obtener perfil del usuario autenticado
router.get('/perfil', verificar_token, authController.perfil);

module.exports = router;
