// backend/src/routes/authRoutes.js

const express = require("express");
const router = express.Router();

// CORREÇÃO: Usar '../' para acessar as pastas irmãs (controllers, middlewares, schemas)
const authController = require("./backend/src/controllers/AuthController");
const validation = require("./backend/src/middlewares/validationMiddleware");
const { loginSchema } = require("./backend/src/schemas/validationSchemas");

// [LOGIN] POST /login
router.post("/", validation(loginSchema), authController.login);

module.exports = router;
