const express = require('express');
const router = express.Router();
const prestamoController = require('../controllers/PrestamoController');
const { verificar_token, verificar_rol_admin } = require('../middlewares/autenticar');

router.use(verificar_token);

router.post('/solicitar', prestamoController.solicitarPrestamo);
router.get('/mis-prestamos', prestamoController.misPrestamos);
router.get('/todos', verificar_rol_admin, prestamoController.listarTodosPrestamos);
router.post('/aprobar/:id', verificar_rol_admin, prestamoController.aprobarPrestamo);

module.exports = router;
