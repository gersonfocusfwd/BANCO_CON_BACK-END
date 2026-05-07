require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
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

// Middleware para cookies
app.use(cookieParser());

// Habilitar CORS para permitir conexión con el frontend y envío de cookies
app.use(cors({
  origin: 'http://localhost:5173', // Ajusta según el puerto de tu frontend
  credentials: true
}));

// Importación de rutas
const usuarioRoutes = require('./routes/usuarioRoutes');
const cuentaRoutes = require('./routes/cuentaRoutes');
const transaccionRoutes = require('./routes/transaccionRoutes');
const authRoutes = require('./routes/authRoutes');
const tarjetaRoutes = require('./routes/tarjetaRoutes');
const creditoRoutes = require('./routes/creditoRoutes');
const prestamoRoutes = require('./routes/prestamoRoutes');
const extraRoutes = require('./routes/extraRoutes');

// Registro de rutas en la API
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/cuentas', cuentaRoutes);
app.use('/api/transacciones', transaccionRoutes);
app.use('/api/tarjetas', tarjetaRoutes);
app.use('/api/credito', creditoRoutes);
app.use('/api/prestamos', prestamoRoutes);
app.use('/api/extra', extraRoutes);

// Función de inicio de servidor
const iniciarServidor = async () => {
  try {
    // Sincronización automática de modelos con la base de datos
    await db.sequelize.sync();
    console.log('\x1b[32m%s\x1b[0m', '✓ Conexión y sincronización de tablas exitosa.');

    app.listen(PORT, () => {
      console.log('\x1b[32m%s\x1b[0m', `✓ Servidor API corriendo en el puerto ${PORT}`);
      console.log('\x1b[35m%s\x1b[0m', `--------------------------------------------------`);
      console.log('\x1b[36m%s\x1b[0m', `🚀 ACCESO AL FRONTEND: http://localhost:5173`);
      console.log('\x1b[33m%s\x1b[0m', `📂 DOCUMENTACIÓN API:  http://localhost:${PORT}/api/usuarios`);
      console.log('\x1b[35m%s\x1b[0m', `--------------------------------------------------`);
    });
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '✗ Error al conectar con la base de datos:', error);
  }
};

iniciarServidor();
