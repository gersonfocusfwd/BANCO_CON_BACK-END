const db = require('./models');

const verificarTablaTarjetas = async () => {
  try {
    const [results] = await db.sequelize.query("DESCRIBE tarjetas;");
    console.log('📋 Estructura de la tabla tarjetas:');
    console.table(results);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al verificar tabla:', error);
    process.exit(1);
  }
};

verificarTablaTarjetas();
