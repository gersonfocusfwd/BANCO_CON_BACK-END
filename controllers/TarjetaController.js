const { Tarjeta, Usuario } = require('../models');

/**
 * [FUNCIÓN: listarTarjetas]
 * Obtiene todas las tarjetas vinculadas a un usuario específico.
 */
const listarTarjetas = async (req, res) => {
  try {
    const usuario_id = req.usuario.id; // Obtenido del token
    const tarjetas = await Tarjeta.findAll({
      where: { usuario_id }
    });
    res.status(200).json({ ok: true, data: tarjetas });
  } catch (error) {
    res.status(500).json({ ok: false, msg: 'Error al obtener tarjetas', error: error.message });
  }
};

/**
 * [FUNCIÓN: crearTarjeta]
 * Registra una nueva tarjeta física o virtual en el sistema.
 */
const crearTarjeta = async (req, res) => {
  try {
    const { numero_tarjeta, tipo, marca, cvv, fecha_expiracion, limite } = req.body;
    const usuario_id = req.usuario.id;

    const nuevaTarjeta = await Tarjeta.create({
      numero_tarjeta,
      tipo,
      marca,
      cvv,
      fecha_expiracion,
      limite,
      usuario_id
    });

    res.status(201).json({ ok: true, msg: 'Tarjeta vinculada exitosamente', data: nuevaTarjeta });
  } catch (error) {
    res.status(400).json({ ok: false, msg: 'Error al vincular tarjeta', error: error.message });
  }
};

/**
 * [FUNCIÓN: cambiarEstado]
 * Bloquea o activa una tarjeta por seguridad.
 */
const cambiarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const tarjeta = await Tarjeta.findByPk(id);
    if (!tarjeta) return res.status(404).json({ ok: false, msg: 'Tarjeta no encontrada' });

    tarjeta.estado = estado;
    await tarjeta.save();

    res.json({ ok: true, msg: `Tarjeta marcada como ${estado}`, data: tarjeta });
  } catch (error) {
    res.status(400).json({ ok: false, msg: 'Error al cambiar estado', error: error.message });
  }
};

/**
 * [FUNCIÓN: eliminarTarjeta]
 * Elimina una tarjeta del sistema.
 */
const eliminarTarjeta = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Tarjeta.destroy({ where: { id, usuario_id: req.usuario.id } });
    
    if (eliminado) {
      return res.json({ ok: true, msg: 'Tarjeta eliminada correctamente' });
    }
    throw new Error('Tarjeta no encontrada');
  } catch (error) {
    res.status(400).json({ ok: false, msg: 'Error al eliminar tarjeta', error: error.message });
  }
};

module.exports = {
  listarTarjetas,
  crearTarjeta,
  cambiarEstado,
  eliminarTarjeta
};
