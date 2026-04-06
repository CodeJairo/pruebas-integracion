/**
 * userService.js
 *
 * Servicio de usuarios.
 * Contiene la lógica de negocio para registrar usuarios.
 * Depende de:
 *   - userRepository: para guardar el usuario en la base de datos
 *   - emailService: para enviar el correo de bienvenida
 */

const userRepository = require('./userRepository');
const emailService = require('./utils/emailService');

/**
 * Registra un nuevo usuario en el sistema.
 *
 * Flujo:
 * 1. Guarda el usuario en la base de datos usando el repositorio
 * 2. Envía un correo de bienvenida al usuario
 * 3. Retorna el usuario creado
 *
 * @param {Object} userData - Datos del usuario (ej: { email, nombre })
 * @returns {Promise<Object>} - El usuario creado con su id
 */
async function registerUser(userData) {
  // Paso 1: Guardar el usuario en la base de datos
  const user = await userRepository.save(userData);

  // Paso 2: Enviar correo de bienvenida
  await emailService.sendWelcomeEmail(user.email);

  // Paso 3: Retornar el usuario creado
  return user;
}

module.exports = { registerUser };
