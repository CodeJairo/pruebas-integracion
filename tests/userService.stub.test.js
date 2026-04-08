const { registerUser } = require("../src/services/userService");
const userRepository = require("../src/repositories/userRepository");
const emailService = require("../src/utils/emailService");

beforeEach(() => {
  emailService.sendWelcomeEmail = jest.fn().mockResolvedValue(undefined);
});
afterEach(() => {
  jest.restoreAllMocks();
});

describe("Punto 1 - Prueba con Stubs: registerUser", () => {
  test("debe crear un usuario usando el stub del repositorio", async () => {
    const usuarioDePrueba = { email: "test@test.com", nombre: "Juan" };

    const usuarioFalso = { id: 1, email: "test@test.com", nombre: "Juan" };

    userRepository.save = jest.fn().mockResolvedValue(usuarioFalso);
    const resultado = await registerUser(usuarioDePrueba);

    expect(resultado).toEqual(usuarioFalso);

    expect(userRepository.save).toHaveBeenCalledTimes(1);

    expect(userRepository.save).toHaveBeenCalledWith(usuarioDePrueba);
  });

  test("el usuario retornado debe tener id y email", async () => {
    const usuarioDePrueba = { email: "otro@correo.com", nombre: "Maria" };
    const usuarioFalso = { id: 2, email: "otro@correo.com", nombre: "Maria" };

    userRepository.save = jest.fn().mockResolvedValue(usuarioFalso);

    const resultado = await registerUser(usuarioDePrueba);

    expect(resultado).toHaveProperty("id");
    expect(resultado).toHaveProperty("email", "otro@correo.com");
  });
});
