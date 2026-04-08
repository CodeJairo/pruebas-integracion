jest.mock("../src/utils/emailService");

const request = require("supertest");
const app = require("../src/app");
const userRepository = require("../src/repositories/userRepository");
const emailService = require("../src/utils/emailService");

beforeEach(() => {
  userRepository.save = jest.fn().mockResolvedValue({
    id: 1,
    email: "test@test.com",
    nombre: "Ana",
  });

  emailService.sendWelcomeEmail.mockResolvedValue(undefined);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Punto 3 - Prueba con Drivers HTTP: POST /users", () => {
  test("POST /users debe retornar 201 cuando el registro es exitoso", async () => {
    const respuesta = await request(app)
      .post("/users")
      .send({ email: "test@test.com", nombre: "Ana" });

    expect(respuesta.statusCode).toBe(201);
  });

  test("POST /users debe retornar el usuario creado en el body", async () => {
    const respuesta = await request(app)
      .post("/users")
      .send({ email: "test@test.com", nombre: "Ana" });

    expect(respuesta.body).toHaveProperty(
      "message",
      "Usuario creado",
    );
    expect(respuesta.body).toHaveProperty("user");
    expect(respuesta.body.user).toHaveProperty("id", 1);
    expect(respuesta.body.user).toHaveProperty("email", "test@test.com");
  });

  test("POST /users debe llamar al repositorio y al servicio de correo", async () => {
    await request(app)
      .post("/users")
      .send({ email: "test@test.com", nombre: "Ana" });

    expect(userRepository.save).toHaveBeenCalledTimes(1);
    expect(userRepository.save).toHaveBeenCalledWith({
      email: "test@test.com",
      nombre: "Ana",
    });

    expect(emailService.sendWelcomeEmail).toHaveBeenCalledTimes(1);
    expect(emailService.sendWelcomeEmail).toHaveBeenCalledWith("test@test.com");
  });

  test("POST /users debe retornar 400 si no se envía el email", async () => {
    const respuesta = await request(app)
      .post("/users")
      .send({ nombre: "Sin Email" });

    expect(respuesta.statusCode).toBe(400);
    expect(respuesta.body).toHaveProperty("error", "El email es obligatorio");
  });

  test("POST /users debe aceptar la petición con Content-Type application/json", async () => {
    const respuesta = await request(app)
      .post("/users")
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ email: "json@test.com", nombre: "JSON User" }));

    expect(respuesta.statusCode).toBe(201);
  });
});
