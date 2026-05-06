const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const { autenticarToken } = require('../middlewares/autenticar');

/**
 * /////////////////////////////////////////////////////////////
 * // DEFINICIÓN DE RUTAS PARA AUTENTICACIÓN
 * /////////////////////////////////////////////////////////////
 */

// Ruta para registro de usuarios
router.post('/registro', authController.registrar);

// Ruta para inicio de sesión
router.post('/login', authController.login);

// Ruta para cerrar sesión
router.post('/logout', authController.logout);

// Ruta para obtener perfil del usuario autenticado
router.get('/perfil', autenticarToken, authController.perfil);

module.exports = router;
