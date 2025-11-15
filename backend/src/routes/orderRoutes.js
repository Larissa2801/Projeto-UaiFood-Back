// backend/src/routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/OrderController");
const { verifyToken, checkRole } = require("../middlewares/authMiddleware");
// Importar validation e schemas

// Rotas de Pedido (CRUD BÁSICO)
router.post("/", verifyToken, orderController.create);
router.get("/:id", verifyToken, orderController.findById);

// Rota de Status (Requer ADMIN)
router.put(
  "/:id/status",
  verifyToken,
  checkRole("ADMIN"),
  orderController.updateStatus
);

module.exports = router;
