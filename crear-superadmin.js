const db = require('./models');

const crearSuperAdmin = async () => {
  try {
    // Sincronizar la base de datos
    await db.sequelize.sync();

    const datosSuperAdmin = {
      nombre: 'Super Administrador',
      email: 'superadmin@banco.com',
      cedula: '999999999',
      password: 'superpassword2024', // Contraseña fuerte para el super admin
      rol: 'superadmin'
    };

    // Eliminar si ya existe para asegurar los datos correctos
    await db.Usuario.destroy({ where: { email: datosSuperAdmin.email } });

    await db.Usuario.create(datosSuperAdmin);
    console.log('\x1b[35m%s\x1b[0m', '👑 SUPER ADMINISTRADOR CREADO EXITOSAMENTE:');
    console.log('--------------------------------------------------');
    console.log('📧 Email:    ' + datosSuperAdmin.email);
    console.log('🔑 Password: ' + datosSuperAdmin.password);
    console.log('🛡️ Rol:      ' + datosSuperAdmin.rol);
    console.log('--------------------------------------------------');
    console.log('¡Usa estas credenciales para recuperar el control!');

    process.exit(0);
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '✗ Error al crear el Super Admin:', error);
    process.exit(1);
  }
};

crearSuperAdmin();
