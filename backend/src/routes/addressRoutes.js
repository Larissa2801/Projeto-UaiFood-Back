// backend/src/routes/addressRoutes.js

const express = require("express");
// Usamos { mergeParams: true } para acessar o :userId da rota pai
const router = express.Router({ mergeParams: true });
const addressController = require("../controllers/AddressController");
const { verifyToken } = require("../middlewares/authMiddleware");
const validation = require("../middlewares/validationMiddleware");
const { addressUpsertSchema } = require("../schemas/validationSchemas"); // Garanta que este schema existe

// Todas as rotas de endereço exigem AUTENTICAÇÃO e o CONTROLLER lida com a autorização (P2)
router.get("/", verifyToken, addressController.findByUserId);

// O PUT será o método padrão para o UPSERT (Update/Insert)
router.put(
  "/",
  verifyToken,
  validation(addressUpsertSchema),
  addressController.upsert
);

router.delete("/", verifyToken, addressController.delete);

module.exports = router;
