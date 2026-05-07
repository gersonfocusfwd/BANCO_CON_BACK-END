const db = require('./models');

const actualizarEnumYCrearSuperAdmin = async () => {
  try {
    console.log('🔄 Actualizando esquema de base de datos...');
    
    // Actualizar el ENUM manualmente vía Query
    await db.sequelize.query("ALTER TABLE usuarios MODIFY COLUMN rol ENUM('admin', 'cliente', 'superadmin') DEFAULT 'cliente';");
    console.log('✅ Columna "rol" actualizada a superadmin.');

    const datosSuperAdmin = {
      nombre: 'Super Administrador',
      email: 'superadmin@banco.com',
      cedula: '999999999',
      password: 'superpassword2024',
      rol: 'superadmin'
    };

    await db.Usuario.destroy({ where: { email: datosSuperAdmin.email } });
    await db.Usuario.create(datosSuperAdmin);
    
    console.log('\x1b[35m%s\x1b[0m', '👑 SUPER ADMINISTRADOR CREADO EXITOSAMENTE');
    console.log('📧 Email: ' + datosSuperAdmin.email);
    console.log('🔑 Pass:  ' + datosSuperAdmin.password);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

actualizarEnumYCrearSuperAdmin();
