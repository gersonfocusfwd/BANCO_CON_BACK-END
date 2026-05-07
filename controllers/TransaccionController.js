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
 * [FUNCIÓN: realizarTransferencia]
 * Descripción: Transfiere saldo de una cuenta origen a una cuenta destino.
 * Valida saldo suficiente y actualiza ambas cuentas en la misma operación.
 */
const realizarTransferencia = async (req, res) => {
  const { cuenta_origen_id, numero_cuenta_destino, monto, descripcion } = req.body;

  try {
    // Validaciones básicas
    const montoNum = parseFloat(monto);
    if (!montoNum || montoNum <= 0) {
      return res.status(400).json({ ok: false, msg: 'El monto debe ser mayor a cero.' });
    }

    // Buscar cuenta origen (debe pertenecer al usuario autenticado)
    const cuentaOrigen = await Cuenta.findOne({
      where: { id: cuenta_origen_id, usuario_id: req.usuario.id }
    });
    if (!cuentaOrigen) {
      return res.status(404).json({ ok: false, msg: 'Cuenta de origen no encontrada o no te pertenece.' });
    }

    // Verificar saldo suficiente
    if (parseFloat(cuentaOrigen.saldo) < montoNum) {
      return res.status(400).json({ ok: false, msg: 'Saldo insuficiente para realizar la transferencia.' });
    }

    // Buscar cuenta destino por número de cuenta
    const cuentaDestino = await Cuenta.findOne({ where: { numero_cuenta: numero_cuenta_destino } });
    if (!cuentaDestino) {
      return res.status(404).json({ ok: false, msg: 'El número de cuenta destino no existe en el sistema.' });
    }

    // No permitir transferencia a la misma cuenta
    if (cuentaOrigen.id === cuentaDestino.id) {
      return res.status(400).json({ ok: false, msg: 'No puedes transferir a tu misma cuenta.' });
    }

    // Debitar cuenta origen
    await cuentaOrigen.update({ saldo: parseFloat(cuentaOrigen.saldo) - montoNum });

    // Acreditar cuenta destino
    await cuentaDestino.update({ saldo: parseFloat(cuentaDestino.saldo) + montoNum });

    // Registrar la transacción
    const transaccion = await Transaccion.create({
      cuenta_origen_id: cuentaOrigen.id,
      cuenta_destino_id: cuentaDestino.id,
      monto: montoNum,
      tipo: 'transferencia',
      descripcion: descripcion || 'Transferencia bancaria',
      estado: 'completada'
    });

    return res.status(201).json({
      ok: true,
      msg: `Transferencia de $${montoNum.toFixed(2)} realizada con éxito.`,
      data: transaccion
    });

  } catch (error) {
    res.status(500).json({ ok: false, msg: 'Error interno al procesar la transferencia.', error: error.message });
  }
};

/**
 * [FUNCIÓN: miHistorial]
 * Descripción: Devuelve las transacciones donde el usuario fue origen o destino.
 */
const miHistorial = async (req, res) => {
  try {
    const { Op } = require('sequelize');

    // Buscar las cuentas del usuario autenticado
    const misCuentas = await Cuenta.findAll({
      where: { usuario_id: req.usuario.id },
      attributes: ['id']
    });

    // Si el usuario no tiene cuentas, retornar lista vacía (no crashear)
    if (!misCuentas || misCuentas.length === 0) {
      return res.json({ ok: true, data: [] });
    }

    const misCuentasIds = misCuentas.map(c => c.id);

    const transacciones = await Transaccion.findAll({
      where: {
        [Op.or]: [
          { cuenta_origen_id: { [Op.in]: misCuentasIds } },
          { cuenta_destino_id: { [Op.in]: misCuentasIds } }
        ]
      },
      include: [
        { model: Cuenta, as: 'cuenta_origen',  attributes: ['numero_cuenta'] },
        { model: Cuenta, as: 'cuenta_destino', attributes: ['numero_cuenta'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: 20
    });

    res.json({ ok: true, data: transacciones });
  } catch (error) {
    res.status(500).json({ ok: false, msg: 'Error al obtener historial', error: error.message });
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
  realizarTransferencia,
  miHistorial,
  actualizarTransaccion,
  eliminarTransaccion
};
