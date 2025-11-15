// backend/src/routes/itemRoutes.js
const express = require("express");
const router = express.Router();
const itemController = require("../controllers/ItemController");
const { verifyToken, checkRole } = require("../middlewares/authMiddleware");

// Rotas de Catálogo exigem ADMIN para modificação.
router.post("/", verifyToken, checkRole("ADMIN"), itemController.create);
router.put("/:id", verifyToken, checkRole("ADMIN"), itemController.update);
router.delete("/:id", verifyToken, checkRole("ADMIN"), itemController.delete);

// Rotas de leitura do catálogo podem ser públicas
router.get("/", itemController.findAll);
router.get("/:id", itemController.findById);

module.exports = router;
