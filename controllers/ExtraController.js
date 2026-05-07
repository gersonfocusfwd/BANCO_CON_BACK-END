const { Beneficiario, Notificacion } = require('../models');

// Beneficiarios
const listarBeneficiarios = async (req, res) => {
  try {
    const beneficiarios = await Beneficiario.findAll({ where: { usuario_id: req.usuario.id } });
    res.json({ ok: true, data: beneficiarios });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

const agregarBeneficiario = async (req, res) => {
  try {
    const beneficiario = await Beneficiario.create({ ...req.body, usuario_id: req.usuario.id });
    res.status(201).json({ ok: true, data: beneficiario });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

// Notificaciones
const misNotificaciones = async (req, res) => {
  try {
    const notis = await Notificacion.findAll({ 
      where: { usuario_id: req.usuario.id },
      order: [['created_at', 'DESC']]
    });
    res.json({ ok: true, data: notis });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

const marcarLeida = async (req, res) => {
  try {
    await Notificacion.update({ leido: true }, { where: { id: req.params.id, usuario_id: req.usuario.id } });
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

module.exports = {
  listarBeneficiarios,
  agregarBeneficiario,
  misNotificaciones,
  marcarLeida
};
