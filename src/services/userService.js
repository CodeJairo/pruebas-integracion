const userRepository = require("../repositories/userRepository");
const emailService = require("../utils/emailService");

async function registerUser(userData) {
  // Paso 1: Guardar el usuario en la base de datos
  const user = await userRepository.save(userData);

  // Paso 2: Enviar correo de bienvenida
  await emailService.sendWelcomeEmail(user.email);

  // Paso 3: Retornar el usuario creado
  return user;
}

module.exports = { registerUser };
