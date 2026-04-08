// Base de datos simulada en memoria
const usuarios = [];

const userRepository = {
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
