/**
 * userRepository.js
 *
 * Repositorio de usuarios.
 * En un proyecto real, aquí se conectaría a una base de datos (PostgreSQL, MongoDB, etc.).
 * Para este taller, simularemos la base de datos con un arreglo en memoria.
 */

// Base de datos simulada en memoria
const usuarios = [];

const userRepository = {
  /**
   * Guarda un usuario en la "base de datos".
   * @param {Object} userData - Datos del usuario (ej: { email, nombre })
   * @returns {Promise<Object>} - El usuario guardado con un id asignado
   */
  save: async (userData) => {
    const nuevoUsuario = {
      id: usuarios.length + 1,
      ...userData,
    };
    usuarios.push(nuevoUsuario);
    return nuevoUsuario;
  },
};

module.exports = userRepository;
