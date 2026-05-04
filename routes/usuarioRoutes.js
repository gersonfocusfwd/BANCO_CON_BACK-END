const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/UsuarioController');

/**
 * /////////////////////////////////////////////////////////////
 * // DEFINICIÓN DE RUTAS PARA USUARIOS
 * /////////////////////////////////////////////////////////////
 */

router.get('/', usuarioController.listarUsuarios);
router.post('/', usuarioController.crearUsuario);
router.patch('/:id', usuarioController.actualizarUsuario);
router.delete('/:id', usuarioController.eliminarUsuario);

module.exports = router;
