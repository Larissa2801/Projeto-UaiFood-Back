// backend/src/routes/userRoutes.js

const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const { verifyToken, checkRole } = require("../middlewares/authMiddleware");
const validation = require("../middlewares/validationMiddleware");
const {
  userCreateSchema,
  userUpdateSchema, // Você deve criar este esquema no validationSchemas.js
} = require("../schemas/validationSchemas");

// Nota: Usaremos userCreateSchema para o POST e userUpdateSchema para o PUT.

// [CREATE] POST /users (Cadastro)
router.post("/", validation(userCreateSchema), userController.create);

// [READ ALL] GET /users (Requer ADMIN)
router.get("/", verifyToken, checkRole("ADMIN"), userController.findAll);

// [READ ONE], [UPDATE], [DELETE] /users/:id (Exigem Autenticação)
router.get("/:id", verifyToken, userController.findById);

router.put(
  "/:id",
  verifyToken, // <-- Mova verifyToken para antes de validation!
  validation(userUpdateSchema),
  userController.update
);

router.delete("/:id", verifyToken, checkRole("ADMIN"), userController.delete);
module.exports = router;
