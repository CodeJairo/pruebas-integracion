jest.mock("../src/utils/emailService");

const { registerUser } = require("../src/services/userService");
const userRepository = require("../src/repositories/userRepository");
const emailService = require("../src/utils/emailService");

beforeEach(() => {
  userRepository.save = jest.fn().mockResolvedValue({
    id: 1,
    email: "test@test.com",
    nombre: "Carlos",
  });

  emailService.sendWelcomeEmail.mockResolvedValue(undefined);
});
afterEach(() => {
  jest.clearAllMocks();
});

describe("Punto 2 - Prueba con Mocks: envío de correo en registerUser", () => {
  test("debe llamar a sendWelcomeEmail después de registrar el usuario", async () => {
    const usuarioDePrueba = { email: "test@test.com", nombre: "Carlos" };

    await registerUser(usuarioDePrueba);

    expect(emailService.sendWelcomeEmail).toHaveBeenCalledTimes(1);
  });

  test("debe enviar el correo al email correcto del usuario", async () => {
    const usuarioDePrueba = { email: "test@test.com", nombre: "Carlos" };

    await registerUser(usuarioDePrueba);

    expect(emailService.sendWelcomeEmail).toHaveBeenCalledWith("test@test.com");
  });

  test("el flujo completo debe registrar usuario Y enviar correo", async () => {
    const usuarioDePrueba = { email: "test@test.com", nombre: "Carlos" };

    const resultado = await registerUser(usuarioDePrueba);

    expect(userRepository.save).toHaveBeenCalledTimes(1);

    expect(emailService.sendWelcomeEmail).toHaveBeenCalledTimes(1);

    expect(resultado).toHaveProperty("id", 1);
    expect(resultado).toHaveProperty("email", "test@test.com");
  });
});
