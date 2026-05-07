const db = require('./models');

const actualizarTransacciones = async () => {
  try {
    console.log('🔄 Actualizando tabla transacciones...');
    
    // Agregar columna descripcion si no existe
    await db.sequelize.query(
      "ALTER TABLE transacciones ADD COLUMN IF NOT EXISTS descripcion VARCHAR(255) NULL;"
    ).catch(() => console.log('  ↳ descripcion ya existe, omitiendo.'));

    // Agregar columna estado si no existe
    await db.sequelize.query(
      "ALTER TABLE transacciones ADD COLUMN IF NOT EXISTS estado ENUM('pendiente','completada','rechazada') DEFAULT 'completada';"
    ).catch(() => console.log('  ↳ estado ya existe, omitiendo.'));

    console.log('✅ Tabla transacciones actualizada correctamente.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

actualizarTransacciones();
