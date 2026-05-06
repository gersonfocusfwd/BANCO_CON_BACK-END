const db = require('./models');

const crearUsuarioPrueba = async () => {
  try {
    // Sincronizar la base de datos primero
    await db.sequelize.sync();

    // Datos del usuario de prueba
    const datosUsuario = {
      nombre: 'Administrador Banco',
      email: 'admin@banco.com',
      cedula: '000000000',
      password: 'adminpassword',
      rol: 'admin'
    };

    // Eliminar si ya existe para asegurar los datos correctos
    await db.Usuario.destroy({ where: { email: datosUsuario.email } });

    await db.Usuario.create(datosUsuario);
    console.log('\x1b[32m%s\x1b[0m', '✓ Usuario de prueba (re)creado exitosamente:');
    console.log('  Email: ' + datosUsuario.email);
    console.log('  Password: ' + datosUsuario.password);

    process.exit(0);
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '✗ Error al crear el usuario:', error);
    process.exit(1);
  }
};

crearUsuarioPrueba();
