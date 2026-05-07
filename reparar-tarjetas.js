const db = require('./models');

const arreglarTablaTarjetas = async () => {
  try {
    console.log('🔄 Reparando tabla tarjetas...');
    
    // 1. Aumentar longitud de numero_tarjeta
    await db.sequelize.query("ALTER TABLE tarjetas MODIFY COLUMN numero_tarjeta VARCHAR(30) NOT NULL UNIQUE;");
    console.log('✅ numero_tarjeta actualizado a VARCHAR(30).');

    // 2. Agregar usuario_id si no existe
    await db.sequelize.query("ALTER TABLE tarjetas ADD COLUMN usuario_id INT AFTER id;");
    console.log('✅ Columna usuario_id añadida.');

    // 3. Agregar la llave foránea
    await db.sequelize.query("ALTER TABLE tarjetas ADD CONSTRAINT fk_usuario_tarjeta FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE;");
    console.log('✅ Llave foránea vinculada.');

    console.log('\x1b[32m%s\x1b[0m', '🚀 TABLA REPARADA EXITOSAMENTE');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al reparar tabla:', error.message);
    process.exit(1);
  }
};

arreglarTablaTarjetas();
