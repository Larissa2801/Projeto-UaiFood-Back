// backend/src/routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/CategoryController");
const { verifyToken, checkRole } = require("../middlewares/authMiddleware");
// Importar validation e schemas (Você criará estes schemas)

// Rotas de Catálogo exigem ADMIN para modificação.
router.post("/", verifyToken, checkRole("ADMIN"), categoryController.create);
router.put("/:id", verifyToken, checkRole("ADMIN"), categoryController.update);
router.delete(
  "/:id",
  verifyToken,
  checkRole("ADMIN"),
  categoryController.delete
);

// Rotas de leitura do catálogo podem ser públicas (vitrine)
router.get("/", categoryController.findAll);
router.get("/:id", categoryController.findById);

module.exports = router;
