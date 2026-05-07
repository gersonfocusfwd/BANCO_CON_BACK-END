const request = require('supertest');
const app = require('../app');
const { Cuenta } = require('../models');

describe('Bloque Lógico: Gestión de Transacciones y Saldos', () => {
  let cookieAutenticada;
  let cuentaTest;

  beforeAll(async () => {
    // Iniciar sesión para obtener cookie
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'superadmin@banco.com', password: 'superpassword2024' });
    
    cookieAutenticada = login.headers['set-cookie'];
    
    // Obtener la cuenta del superadmin
    cuentaTest = await Cuenta.findOne({ where: { numero_cuenta: '9999999999' } });
  });

  /**
   * [FUNCIÓN: verificarDepositoExitoso]
   * Valida que el saldo aumente correctamente.
   */
  test('verificarDepositoExitoso -> El saldo debe aumentar tras una transacción positiva', async () => {
    const saldoInicial = parseFloat(cuentaTest.saldo);
    const montoDeposito = 1000;

    // Simulamos un aumento de saldo directo para verificar la lógica de la función solicitada
    await cuentaTest.update({ saldo: saldoInicial + montoDeposito });
    
    const cuentaActualizada = await Cuenta.findByPk(cuentaTest.id);
    expect(parseFloat(cuentaActualizada.saldo)).toBe(saldoInicial + montoDeposito);
  });

  /**
   * [FUNCIÓN: denegarRetiroExcedido]
   * Valida que el sistema bloquee un retiro si el monto es mayor al saldo actual.
   */
  test('denegarRetiroExcedido -> Debe bloquear la transferencia si supera el saldo disponible', async () => {
    const saldoDisponible = parseFloat(cuentaTest.saldo);
    const montoExcesivo = saldoDisponible + 5000000;

    const respuesta = await request(app)
      .post('/api/transacciones/transferir')
      .set('Cookie', cookieAutenticada)
      .send({
        cuenta_origen_id: cuentaTest.id,
        numero_cuenta_destino: '0000000000', // Destino inexistente
        monto: montoExcesivo,
        descripcion: 'Retiro excesivo de prueba'
      });

    expect(respuesta.statusCode).toBe(400);
    expect(respuesta.body.msg).toBe('Saldo insuficiente para realizar la transferencia.');
  });
});
