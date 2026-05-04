const { Transaccion, Cuenta } = require('../models');

/**
 * /////////////////////////////////////////////////////////////
 * // SECCIÓN DE CONTROLADORES PARA TRANSACCIONES
 * /////////////////////////////////////////////////////////////
 */

/**
 * [FUNCIÓN: listarTransacciones]
 * Descripción: Muestra el historial completo de transacciones del banco.
 */
const listarTransacciones = async (req, res) => {
  try {
    const transacciones = await Transaccion.findAll({
      include: [
        { model: Cuenta, as: 'cuenta_origen', attributes: ['numero_cuenta'] },
        { model: Cuenta, as: 'cuenta_destino', attributes: ['numero_cuenta'] }
      ]
    });
    res.status(200).json({
      ok: true,
      data: transacciones
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener el historial de transacciones',
      error: error.message
    });
  }
};

/**
 * [FUNCIÓN: crearTransaccion]
 * Descripción: Registra una nueva operación bancaria (transferencia, depósito, retiro).
 */
const crearTransaccion = async (req, res) => {
  try {
    const nuevaTransaccion = await Transaccion.create(req.body);
    res.status(201).json({
      ok: true,
      msg: 'Transacción realizada con éxito',
      data: nuevaTransaccion
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: 'Error al procesar la transacción',
      error: error.message
    });
  }
};

/**
 * [FUNCIÓN: actualizarTransaccion]
 * Descripción: Corrige o modifica los detalles de una transacción existente.
 */
const actualizarTransaccion = async (req, res) => {
  try {
    const { id } = req.params;
    const [actualizado] = await Transaccion.update(req.body, { where: { id } });
    
    if (actualizado) {
      const transaccionActualizada = await Transaccion.findByPk(id);
      return res.status(200).json({
        ok: true,
        msg: 'Transacción actualizada correctamente',
        data: transaccionActualizada
      });
    }
    throw new Error('Transacción no encontrada');
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: 'Error al actualizar la transacción',
      error: error.message
    });
  }
};

/**
 * [FUNCIÓN: eliminarTransaccion]
 * Descripción: Elimina un registro de transacción del historial.
 */
const eliminarTransaccion = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminada = await Transaccion.destroy({ where: { id } });
    
    if (eliminada) {
      return res.status(200).json({
        ok: true,
        msg: 'Transacción eliminada del historial'
      });
    }
    throw new Error('Transacción no encontrada');
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: 'Error al eliminar la transacción',
      error: error.message
    });
  }
};

module.exports = {
  listarTransacciones,
  crearTransaccion,
  actualizarTransaccion,
  eliminarTransaccion
};
