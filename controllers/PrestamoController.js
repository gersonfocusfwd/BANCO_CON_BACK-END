const { Prestamo, Cuenta, Notificacion } = require('../models');

/**
 * [FUNCIÓN: solicitarPrestamo]
 * Permite a un usuario solicitar un crédito.
 */
const solicitarPrestamo = async (req, res) => {
  try {
    const { monto, plazo_meses, proposito } = req.body;
    
    // Lógica básica de tasa (podría ser dinámica según score)
    const tasa_interes = 15.5; // 15.5% anual
    const montoTotal = parseFloat(monto) * (1 + (tasa_interes / 100));
    const monto_cuota = montoTotal / parseInt(plazo_meses);

    const prestamo = await Prestamo.create({
      usuario_id: req.usuario.id,
      monto,
      tasa_interes,
      plazo_meses,
      monto_cuota,
      proposito,
      estado: 'pendiente'
    });

    await Notificacion.create({
      usuario_id: req.usuario.id,
      titulo: 'Solicitud Recibida',
      mensaje: `Tu solicitud de préstamo por $${monto} está siendo evaluada.`,
      tipo: 'info'
    });

    res.status(201).json({ ok: true, data: prestamo });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

/**
 * [FUNCIÓN: misPrestamos]
 * Lista los préstamos del usuario autenticado.
 */
const misPrestamos = async (req, res) => {
  try {
    const prestamos = await Prestamo.findAll({ where: { usuario_id: req.usuario.id } });
    res.json({ ok: true, data: prestamos });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

/**
 * [FUNCIÓN: aprobarPrestamo] (ADMIN)
 * Aprueba un préstamo y deposita el dinero en la cuenta principal del usuario.
 */
const aprobarPrestamo = async (req, res) => {
  try {
    const { id } = req.params;
    const prestamo = await Prestamo.findByPk(id);

    if (!prestamo) return res.status(404).json({ ok: false, msg: 'Préstamo no encontrado' });
    if (prestamo.estado !== 'pendiente') return res.status(400).json({ ok: false, msg: 'Ya ha sido procesado' });

    // Buscar cuenta principal del usuario o crear una si no existe
    let cuenta = await Cuenta.findOne({ where: { usuario_id: prestamo.usuario_id } });
    
    if (!cuenta) {
      // Abrir cuenta de desembolso automáticamente
      const numero_cuenta = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      cuenta = await Cuenta.create({
        usuario_id: prestamo.usuario_id,
        numero_cuenta: numero_cuenta,
        tipo_cuenta: 'corriente',
        saldo: 0
      });
    }

    // Actualizar estado y depositar dinero
    await prestamo.update({ estado: 'aprobado', fecha_aprobacion: new Date() });
    await cuenta.update({ saldo: parseFloat(cuenta.saldo) + parseFloat(prestamo.monto) });

    await Notificacion.create({
      usuario_id: prestamo.usuario_id,
      titulo: '💰 Préstamo Aprobado',
      mensaje: `Felicidades, tu préstamo de $${prestamo.monto} ha sido depositado en tu cuenta.`,
      tipo: 'exito'
    });

    res.json({ ok: true, msg: 'Préstamo aprobado y fondos transferidos' });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

/**
 * [FUNCIÓN: listarTodosPrestamos] (ADMIN)
 * Lista todas las solicitudes del sistema para gestión administrativa.
 */
const listarTodosPrestamos = async (req, res) => {
  try {
    const { Usuario } = require('../models');
    const prestamos = await Prestamo.findAll({
      include: [{ model: Usuario, as: 'usuario', attributes: ['nombre', 'email'] }]
    });
    res.json({ ok: true, data: prestamos });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

module.exports = {
  solicitarPrestamo,
  misPrestamos,
  aprobarPrestamo,
  listarTodosPrestamos
};
