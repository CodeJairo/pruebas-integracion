/**
 * userRoutes.test.js
 *
 * PUNTO 3: Prueba de integración con DRIVERS (HTTP)
 *
 * ¿Qué es un DRIVER en pruebas?
 * Un driver es una herramienta que actúa como "cliente" para ejercitar el sistema.
 * En este caso, usamos la librería `supertest` como driver HTTP,
 * que simula peticiones reales al servidor Express sin necesitar levantarlo manualmente.
 *
 * Combinamos:
 *   - DRIVER (supertest): para simular la petición HTTP
 *   - STUB (userRepository): para simular la base de datos
 *   - MOCK (emailService): para simular el envío de correo
 */

// Primero mockeamos los módulos externos antes de importar la app
jest.mock('../src/utils/emailService');

const request = require('supertest');
const app = require('../src/app');
const userRepository = require('../src/userRepository');
const emailService = require('../src/utils/emailService');

// Configuramos los mocks y stubs antes de cada prueba
beforeEach(() => {
  // STUB: el repositorio devuelve un usuario falso sin tocar la base de datos
  userRepository.save = jest.fn().mockResolvedValue({
    id: 1,
    email: 'test@test.com',
    nombre: 'Ana',
  });

  // MOCK: el servicio de correo no envía emails reales
  emailService.sendWelcomeEmail.mockResolvedValue(undefined);
});

// Limpiamos los mocks después de cada prueba
afterEach(() => {
  jest.clearAllMocks();
});

describe('Punto 3 - Prueba con Drivers HTTP: POST /users', () => {
  test('POST /users debe retornar 201 cuando el registro es exitoso', async () => {
    // --- ACT ---
    // DRIVER: supertest simula una petición HTTP POST al endpoint /users
    const respuesta = await request(app)
      .post('/users')
      .send({ email: 'test@test.com', nombre: 'Ana' });

    // --- ASSERT ---
    // Verificamos el código de estado HTTP
    expect(respuesta.statusCode).toBe(201);
  });

  test('POST /users debe retornar el usuario creado en el body', async () => {
    // --- ACT ---
    const respuesta = await request(app)
      .post('/users')
      .send({ email: 'test@test.com', nombre: 'Ana' });

    // --- ASSERT ---
    // Verificamos el cuerpo de la respuesta
    expect(respuesta.body).toHaveProperty('message', 'Usuario registrado exitosamente');
    expect(respuesta.body).toHaveProperty('user');
    expect(respuesta.body.user).toHaveProperty('id', 1);
    expect(respuesta.body.user).toHaveProperty('email', 'test@test.com');
  });

  test('POST /users debe llamar al repositorio y al servicio de correo', async () => {
    // --- ACT ---
    await request(app)
      .post('/users')
      .send({ email: 'test@test.com', nombre: 'Ana' });

    // --- ASSERT ---
    // Verificamos que el STUB del repositorio fue llamado
    expect(userRepository.save).toHaveBeenCalledTimes(1);
    expect(userRepository.save).toHaveBeenCalledWith({ email: 'test@test.com', nombre: 'Ana' });

    // Verificamos que el MOCK del correo fue llamado
    expect(emailService.sendWelcomeEmail).toHaveBeenCalledTimes(1);
    expect(emailService.sendWelcomeEmail).toHaveBeenCalledWith('test@test.com');
  });

  test('POST /users debe retornar 400 si no se envía el email', async () => {
    // --- ACT ---
    // Enviamos una petición sin el campo email
    const respuesta = await request(app)
      .post('/users')
      .send({ nombre: 'Sin Email' });

    // --- ASSERT ---
    // El servidor debe responder con error 400 (Bad Request)
    expect(respuesta.statusCode).toBe(400);
    expect(respuesta.body).toHaveProperty('error', 'El email es obligatorio');
  });

  test('POST /users debe aceptar la petición con Content-Type application/json', async () => {
    // --- ACT ---
    const respuesta = await request(app)
      .post('/users')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ email: 'json@test.com', nombre: 'JSON User' }));

    // --- ASSERT ---
    expect(respuesta.statusCode).toBe(201);
  });
});
