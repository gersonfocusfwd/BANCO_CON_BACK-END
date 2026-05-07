const express = require('express');
const router = express.Router();
const tarjetaController = require('../controllers/TarjetaController');
const { verificar_token } = require('../middlewares/autenticar');

// Todas las rutas de tarjetas requieren estar autenticado
router.use(verificar_token);

router.get('/', tarjetaController.listarTarjetas);
router.post('/', tarjetaController.crearTarjeta);
router.patch('/:id/estado', tarjetaController.cambiarEstado);
router.delete('/:id', tarjetaController.eliminarTarjeta);

module.exports = router;
