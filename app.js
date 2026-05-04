require('dotenv').config();
const express = require('express');
const db = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * /////////////////////////////////////////////////////////////
 * // CONFIGURACIÓN DEL SERVIDOR BANCARIO
 * /////////////////////////////////////////////////////////////
 */

// Middleware para procesar JSON
app.use(express.json());

// Importación de rutas
const usuarioRoutes = require('./routes/usuarioRoutes');
const cuentaRoutes = require('./routes/cuentaRoutes');
const transaccionRoutes = require('./routes/transaccionRoutes');

// Registro de rutas en la API
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/cuentas', cuentaRoutes);
app.use('/api/transacciones', transaccionRoutes);

// Función de inicio de servidor
const iniciarServidor = async () => {
  try {
    // Sincronización automática de modelos con la base de datos
    await db.sequelize.sync({ alter: true });
    console.log('\x1b[32m%s\x1b[0m', '✓ Conexión y sincronización de tablas exitosa.');

    app.listen(PORT, () => {
      console.log('\x1b[32m%s\x1b[0m', `✓ Servidor corriendo en el puerto ${PORT}`);
      console.log('\x1b[32m%s\x1b[0m', `✓ API Usuarios: http://localhost:${PORT}/api/usuarios`);
      console.log('\x1b[32m%s\x1b[0m', `✓ API Cuentas: http://localhost:${PORT}/api/cuentas`);
      console.log('\x1b[32m%s\x1b[0m', `✓ API Transacciones: http://localhost:${PORT}/api/transacciones`);
    });
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '✗ Error al conectar con la base de datos:', error);
  }
};

iniciarServidor();
