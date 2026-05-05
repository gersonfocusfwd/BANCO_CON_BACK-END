const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');

/**
 * /////////////////////////////////////////////////////////////
 * // DEFINICIÓN DE RUTAS PARA AUTENTICACIÓN
 * /////////////////////////////////////////////////////////////
 */

// Ruta para registro de usuarios
router.post('/registro', authController.registrar);

// Ruta para inicio de sesión
router.post('/login', authController.login);

module.exports = router;
