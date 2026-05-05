const express = require('express');
const router = express.Router();
const transaccionController = require('../controllers/TransaccionController');
const autenticar = require('../middlewares/autenticar');

// Aplicar middleware de autenticación a todas las rutas de este archivo
router.use(autenticar);

/**
 * /////////////////////////////////////////////////////////////
 * // DEFINICIÓN DE RUTAS PARA TRANSACCIONES
 * /////////////////////////////////////////////////////////////
 */

router.get('/', transaccionController.listarTransacciones);
router.post('/', transaccionController.crearTransaccion);
router.patch('/:id', transaccionController.actualizarTransaccion);
router.delete('/:id', transaccionController.eliminarTransaccion);

module.exports = router;
