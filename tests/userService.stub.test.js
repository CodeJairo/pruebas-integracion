/**
 * userService.stub.test.js
 *
 * PUNTO 1: Prueba de integración con STUBS
 *
 * ¿Qué es un STUB?
 * Un stub es una versión falsa de una función o módulo que reemplaza el comportamiento real
 * por uno controlado. Aquí usamos un stub para simular que el repositorio guarda el usuario
 * sin necesitar una base de datos real.
 *
 * Ventaja: podemos probar la lógica del servicio de forma aislada y rápida.
 */

const { registerUser } = require('../src/userService');
const userRepository = require('../src/userRepository');
const emailService = require('../src/utils/emailService');

// Antes de cada prueba, simulamos el emailService para que no haga nada real
// (esto evita efectos secundarios no deseados en las pruebas de stubs)
beforeEach(() => {
  emailService.sendWelcomeEmail = jest.fn().mockResolvedValue(undefined);
});

// Después de cada prueba, restauramos todos los mocks
afterEach(() => {
  jest.restoreAllMocks();
});

describe('Punto 1 - Prueba con Stubs: registerUser', () => {
  test('debe crear un usuario usando el stub del repositorio', async () => {
    // --- ARRANGE (preparar) ---
    // Definimos el usuario de prueba que enviaremos
    const usuarioDePrueba = { email: 'test@test.com', nombre: 'Juan' };

    // Definimos el resultado falso que queremos que devuelva el repositorio
    const usuarioFalso = { id: 1, email: 'test@test.com', nombre: 'Juan' };

    // STUB: reemplazamos userRepository.save con una función falsa (jest.fn)
    // que devuelve el usuario falso en lugar de conectarse a una base de datos real
    userRepository.save = jest.fn().mockResolvedValue(usuarioFalso);

    // --- ACT (actuar) ---
    // Llamamos a la función que queremos probar
    const resultado = await registerUser(usuarioDePrueba);

    // --- ASSERT (verificar) ---
    // Verificamos que el resultado sea el usuario falso que definimos
    expect(resultado).toEqual(usuarioFalso);

    // Verificamos que el stub fue llamado exactamente una vez
    expect(userRepository.save).toHaveBeenCalledTimes(1);

    // Verificamos que el stub fue llamado con los datos correctos
    expect(userRepository.save).toHaveBeenCalledWith(usuarioDePrueba);
  });

  test('el usuario retornado debe tener id y email', async () => {
    // --- ARRANGE ---
    const usuarioDePrueba = { email: 'otro@correo.com', nombre: 'Maria' };
    const usuarioFalso = { id: 2, email: 'otro@correo.com', nombre: 'Maria' };

    // STUB del repositorio
    userRepository.save = jest.fn().mockResolvedValue(usuarioFalso);

    // --- ACT ---
    const resultado = await registerUser(usuarioDePrueba);

    // --- ASSERT ---
    // Verificamos que el usuario retornado tenga las propiedades esperadas
    expect(resultado).toHaveProperty('id');
    expect(resultado).toHaveProperty('email', 'otro@correo.com');
  });
});
