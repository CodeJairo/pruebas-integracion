/**
 * app.js
 *
 * Aplicación principal de Express.
 * Define los endpoints HTTP de la aplicación.
 *
 * Endpoint disponible:
 *   POST /users - Registra un nuevo usuario
 */

const express = require('express');
const { registerUser } = require('./userService');

const app = express();

// Middleware para parsear el body de las peticiones como JSON
app.use(express.json());

/**
 * POST /users
 *
 * Recibe los datos de un usuario y lo registra en el sistema.
 *
 * Body esperado: { email: string, nombre: string }
 * Respuesta exitosa (201): { message: string, user: Object }
 * Respuesta de error (400): { error: string }
 */
app.post('/users', async (req, res) => {
  const userData = req.body;

  // Validación básica: el email es obligatorio
  if (!userData.email) {
    return res.status(400).json({ error: 'El email es obligatorio' });
  }

  try {
    const user = await registerUser(userData);
    return res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = app;
