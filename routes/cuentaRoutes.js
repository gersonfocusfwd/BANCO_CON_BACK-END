const express = require('express');
const router = express.Router();
const cuentaController = require('../controllers/CuentaController');

/**
 * /////////////////////////////////////////////////////////////
 * // DEFINICIÓN DE RUTAS PARA CUENTAS
 * /////////////////////////////////////////////////////////////
 */

router.get('/', cuentaController.listarCuentas);
router.post('/', cuentaController.crearCuenta);
router.patch('/:id', cuentaController.actualizarCuenta);
router.delete('/:id', cuentaController.eliminarCuenta);

module.exports = router;
