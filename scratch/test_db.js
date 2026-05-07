const { Prestamo, Cuenta, Notificacion, Usuario } = require('../models');

async function test() {
  try {
    const p = await Prestamo.findByPk(1);
    console.log('Prestamo found:', p ? p.id : 'null');
    if (!p) return;
    
    console.log('User ID from prestamo:', p.usuario_id);
    
    const u = await Usuario.findByPk(p.usuario_id);
    console.log('User found:', u ? u.nombre : 'null');
    
    const c = await Cuenta.findOne({ where: { usuario_id: p.usuario_id } });
    console.log('Account found:', c ? c.numero_cuenta : 'null');

    console.log('Testing Notificacion.create...');
    const n = await Notificacion.create({
      usuario_id: p.usuario_id,
      titulo: 'Test',
      mensaje: 'Test msg',
      tipo: 'info'
    });
    console.log('Notification created:', n.id);
    
  } catch (err) {
    console.error('TEST ERROR:', err);
  } finally {
    process.exit();
  }
}

test();
