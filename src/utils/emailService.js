/**
 * emailService.js
 *
 * Servicio de correo electrónico.
 * En un proyecto real, aquí se usaría una librería como Nodemailer o un servicio como SendGrid.
 * Para este taller, la función simplemente imprime un mensaje en consola.
 */

const emailService = {
  /**
   * Envía un correo de bienvenida al usuario recién registrado.
   * @param {string} email - Dirección de correo del usuario
   * @returns {Promise<void>}
   */
  sendWelcomeEmail: async (email) => {
    console.log(`Correo de bienvenida enviado a: ${email}`);
  },
};

module.exports = emailService;
