const express = require("express");
const userController = require("./controllers/userController");

const app = express();

app.use(express.json());

app.post("/users", userController.register);

module.exports = app;
