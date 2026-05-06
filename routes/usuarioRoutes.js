const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/UsuarioController');
const { verificar_token, verificar_rol_admin } = require('../middlewares/autenticar');

/**
 * /////////////////////////////////////////////////////////////
 * // DEFINICIÓN DE RUTAS PARA USUARIOS (ADMINISTRACIÓN)
 * /////////////////////////////////////////////////////////////
 */

// Todas las rutas de gestión de usuarios requieren ser administrador
router.use(verificar_token, verificar_rol_admin);

router.get('/', usuarioController.listarUsuarios);
router.post('/', usuarioController.crearUsuario);
router.patch('/:id', usuarioController.actualizarUsuario);
router.delete('/:id', usuarioController.eliminarUsuario);
router.patch('/roles/:id', usuarioController.gestionar_roles);



module.exports = router;
