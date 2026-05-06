const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/UsuarioController');
const { autenticarToken, esAdministrador } = require('../middlewares/autenticar');

/**
 * /////////////////////////////////////////////////////////////
 * // DEFINICIÓN DE RUTAS PARA USUARIOS (ADMINISTRACIÓN)
 * /////////////////////////////////////////////////////////////
 */

// Todas las rutas de gestión de usuarios requieren ser administrador
router.use(autenticarToken, esAdministrador);

router.get('/', usuarioController.listarUsuarios);
router.post('/', usuarioController.crearUsuario);
router.patch('/:id', usuarioController.actualizarUsuario);
router.delete('/:id', usuarioController.eliminarUsuario);


module.exports = router;
