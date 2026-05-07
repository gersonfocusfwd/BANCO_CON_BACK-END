const { Cuenta, Usuario } = require('../models');

/**
 * /////////////////////////////////////////////////////////////
 * // SECCIÓN DE CONTROLADORES PARA CUENTAS BANCARIAS
 * /////////////////////////////////////////////////////////////
 */

/**
 * [FUNCIÓN: listarCuentas]
 * Descripción: Obtiene la lista de todas las cuentas con la información de su propietario.
 */
const listarCuentas = async (req, res) => {
  try {
    const cuentas = await Cuenta.findAll({
      include: [{ model: Usuario, as: 'usuario', attributes: ['nombre', 'email'] }]
    });
    res.status(200).json({
      ok: true,
      data: cuentas
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener las cuentas',
      error: error.message
    });
  }
};

/**
 * [FUNCIÓN: crearCuenta]
 * Descripción: Apertura una nueva cuenta bancaria vinculada a un usuario.
 */
const crearCuenta = async (req, res) => {
  try {
    const nuevaCuenta = await Cuenta.create(req.body);
    res.status(201).json({
      ok: true,
      msg: 'Cuenta creada exitosamente',
      data: nuevaCuenta
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: 'Error al crear la cuenta',
      error: error.message
    });
  }
};

/**
 * [FUNCIÓN: actualizarCuenta]
 * Descripción: Modifica la información de una cuenta bancaria (tipo, saldo, etc.).
 */
const actualizarCuenta = async (req, res) => {
  try {
    const { id } = req.params;
    const [actualizado] = await Cuenta.update(req.body, { where: { id } });
    
    if (actualizado) {
      const cuentaActualizada = await Cuenta.findByPk(id);
      return res.status(200).json({
        ok: true,
        msg: 'Cuenta actualizada exitosamente',
        data: cuentaActualizada
      });
    }
    throw new Error('Cuenta no encontrada');
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: 'Error al actualizar la cuenta',
      error: error.message
    });
  }
};

/**
 * [FUNCIÓN: eliminarCuenta]
 * Descripción: Cierra y elimina una cuenta bancaria del sistema.
 */
const eliminarCuenta = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminada = await Cuenta.destroy({ where: { id } });
    
    if (eliminada) {
      return res.status(200).json({
        ok: true,
        msg: 'Cuenta eliminada correctamente'
      });
    }
    throw new Error('Cuenta no encontrada');
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: 'Error al eliminar la cuenta',
      error: error.message
    });
  }
};

/**
 * [FUNCIÓN: misCuentas]
 * Descripción: Obtiene las cuentas que pertenecen exclusivamente al usuario autenticado.
 */
const misCuentas = async (req, res) => {
  try {
    const cuentas = await Cuenta.findAll({
      where: { usuario_id: req.usuario.id }
    });
    res.status(200).json({
      ok: true,
      data: cuentas
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener tus cuentas',
      error: error.message
    });
  }
};

module.exports = {
  listarCuentas,
  misCuentas,
  crearCuenta,
  actualizarCuenta,
  eliminarCuenta
};
