const express = require('express');
const router = express.Router();
const creditoController = require('../controllers/CreditoController');
const { verificar_token, verificar_rol_admin } = require('../middlewares/autenticar');

// Solo admins y superadmins pueden usar el verificador crediticio
router.post('/verificar', verificar_token, verificar_rol_admin, creditoController.verificarSituacionCrediticia);
router.post('/perfil-completo', verificar_token, verificar_rol_admin, creditoController.validarPerfilCrediticioCompleto);
router.post('/lookup-nombre', verificar_token, verificar_rol_admin, creditoController.consultarNombrePorCedula);

module.exports = router;
