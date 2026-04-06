/**
 * userService.mock.test.js
 *
 * PUNTO 2: Prueba de integración con MOCKS
 *
 * ¿Qué es un MOCK?
 * Un mock es similar a un stub, pero además de reemplazar el comportamiento real,
 * también nos permite VERIFICAR que ciertas funciones fueron llamadas,
 * con qué argumentos, y cuántas veces.
 *
 * Aquí usamos jest.mock() para simular el módulo completo de emailService,
 * y luego verificamos que sendWelcomeEmail fue llamado correctamente.
 */

// jest.mock() reemplaza TODO el módulo emailService con versiones falsas automáticamente.
// Esto debe hacerse ANTES de importar el módulo que lo usa (userService).
jest.mock('../src/utils/emailService');

const { registerUser } = require('../src/userService');
const userRepository = require('../src/userRepository');
const emailService = require('../src/utils/emailService');

// Antes de cada prueba, configuramos el stub del repositorio
beforeEach(() => {
  // STUB: el repositorio siempre devuelve un usuario falso
  userRepository.save = jest.fn().mockResolvedValue({
    id: 1,
    email: 'test@test.com',
    nombre: 'Carlos',
  });

  // MOCK: emailService.sendWelcomeEmail ya fue reemplazada por jest.mock(),
  // pero configuramos que no falle (devuelve undefined como una promesa resuelta)
  emailService.sendWelcomeEmail.mockResolvedValue(undefined);
});

// Después de cada prueba, limpiamos los mocks para evitar interferencias entre pruebas
afterEach(() => {
  jest.clearAllMocks();
});

describe('Punto 2 - Prueba con Mocks: envío de correo en registerUser', () => {
  test('debe llamar a sendWelcomeEmail después de registrar el usuario', async () => {
    // --- ARRANGE ---
    const usuarioDePrueba = { email: 'test@test.com', nombre: 'Carlos' };

    // --- ACT ---
    await registerUser(usuarioDePrueba);

    // --- ASSERT ---
    // MOCK: verificamos que el servicio de correo fue llamado exactamente una vez
    expect(emailService.sendWelcomeEmail).toHaveBeenCalledTimes(1);
  });

  test('debe enviar el correo al email correcto del usuario', async () => {
    // --- ARRANGE ---
    const usuarioDePrueba = { email: 'test@test.com', nombre: 'Carlos' };

    // --- ACT ---
    await registerUser(usuarioDePrueba);

    // --- ASSERT ---
    // MOCK: verificamos que sendWelcomeEmail fue llamado con el email correcto
    expect(emailService.sendWelcomeEmail).toHaveBeenCalledWith('test@test.com');
  });

  test('el flujo completo debe registrar usuario Y enviar correo', async () => {
    // --- ARRANGE ---
    const usuarioDePrueba = { email: 'test@test.com', nombre: 'Carlos' };

    // --- ACT ---
    const resultado = await registerUser(usuarioDePrueba);

    // --- ASSERT ---
    // Verificamos que el usuario fue guardado (stub del repositorio)
    expect(userRepository.save).toHaveBeenCalledTimes(1);

    // Verificamos que el correo fue enviado (mock del emailService)
    expect(emailService.sendWelcomeEmail).toHaveBeenCalledTimes(1);

    // Verificamos que la función retornó el usuario correcto
    expect(resultado).toHaveProperty('id', 1);
    expect(resultado).toHaveProperty('email', 'test@test.com');
  });
});
