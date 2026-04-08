const { registerUser } = require("../services/userService");

const userController = {
  register: async (req, res) => {
    const userData = req.body;

    if (!userData.email) {
      return res.status(400).json({ error: "El email es obligatorio" });
    }

    try {
      const user = await registerUser(userData);
      return res.status(201).json({
        message: "Usuario creado",
        user,
      });
    } catch (error) {
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  },
};

module.exports = userController;
