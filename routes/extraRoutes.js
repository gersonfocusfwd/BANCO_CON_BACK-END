const express = require('express');
const router = express.Router();
const extraController = require('../controllers/ExtraController');
const { verificar_token } = require('../middlewares/autenticar');

router.use(verificar_token);

// Beneficiarios
router.get('/beneficiarios', extraController.listarBeneficiarios);
router.post('/beneficiarios', extraController.agregarBeneficiario);

// Notificaciones
router.get('/notificaciones', extraController.misNotificaciones);
router.patch('/notificaciones/:id', extraController.marcarLeida);

module.exports = router;
