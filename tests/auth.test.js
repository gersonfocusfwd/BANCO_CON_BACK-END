const request = require('supertest');
const app = require('../app');

describe('Bloque Lógico: Autenticación de Usuarios', () => {
  
  test('registrarUsuarioNuevoValido -> Debería registrar un usuario y devolver 201', async () => {
    const respuesta = await request(app)
      .post('/api/auth/registro')
      .send({
        nombre: 'QA Tester',
        email: `tester${Date.now()}@banco.com`,
        cedula: `QA-${Date.now()}`,
        password: 'password123'
      });

    expect(respuesta.statusCode).toBe(201);
    expect(respuesta.body.mensaje).toContain('exitosamente');
  });

  test('iniciarSesionCredencialesCorrectas -> Debería iniciar sesión y recibir cookie', async () => {
    const respuesta = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'superadmin@banco.com',
        password: 'superpassword2024'
      });

    expect(respuesta.statusCode).toBe(200);
    expect(respuesta.headers['set-cookie']).toBeDefined();
  });
});
