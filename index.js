// index.js (Localizado na raiz: projeto_ifood/)
require("./backend/src/utils/jsonSerializer");
require("dotenv").config({ path: "./backend/.env" });

const express = require("express");
const app = express();
const PORT = 3000;

// Incluindo a pasta 'backend' no caminho
const userController = require("./backend/src/controllers/UserController");
const categoryController = require("./backend/src/controllers/CategoryController");
const itemController = require("./backend/src/controllers/ItemController");
const addressController = require("./backend/src/controllers/AddressController");
const orderController = require("./backend/src/controllers/OrderController"); // Importação ÚNICA
const authController = require("./backend/src/controllers/AuthController");
const validation = require("./backend/src/middlewares/validationMiddleware");
//const { userCreateSchema, loginSchema } = require("./backend/src/schemas/validationSchemas");
const { 
    userCreateSchema, 
    loginSchema, 
    categoryCreateSchema, 
    categoryUpdateSchema,
    itemCreateSchema,
    itemUpdateSchema,
    addressUpsertSchema,
    orderCreateSchema,
    orderUpdateStatusSchema 
} = require("./backend/src/schemas/validationSchemas");
const {
  verifyToken,
  checkRole,
} = require("./backend/src/middlewares/authMiddleware");
const swaggerUi = require("swagger-ui-express"); // [cite: 40]
const swaggerDocs = require("./backend/src/config/swaggerConfig");
const cors = require("cors");
// Aplica o middleware CORS
app.use(
  cors({
    origin: "*", // Permite qualquer origem (Para desenvolvimento)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 1. Configuração do Swagger na rota /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware para processar JSON
app.use(express.json());

// 3. Rota GET no caminho raiz (/) - Livre (pública)
app.get("/", (req, res) => {
  res.send("Bem-vindo ao Laboratório de Rotas de DAW-II");
});

// --- ROTAS DE AUTENTICAÇÃO ---
//app.post("/login", authController.login); // Login é sempre público
app.post("/login", validation(loginSchema), authController.login);

// --- ROTAS CRUD PARA O USUÁRIO (USER) ---

// [CREATE] Cadastro é público
app.post("/users", validation(userCreateSchema), userController.create);

// [READ ALL] ADMIN
app.get("/users", verifyToken, checkRole("ADMIN"), userController.findAll);
// [READ ONE], [UPDATE], [DELETE] - ADMIN (ou lógica de "o próprio usuário")
app.get("/users/:id", verifyToken, userController.findById);
app.put("/users/:id", validation(userCreateSchema), verifyToken, userController.update);
app.delete(
  "/users/:id",
  verifyToken,
  checkRole("ADMIN"),
  userController.delete
);

// --- ROTAS DE CATÁLOGO (CATEGORY e ITEM) ---

// Criação/Atualização/Deleção de Catálogo são tarefas ADMIN
app.post(
  "/categories",
  verifyToken,
  checkRole("ADMIN"),
  categoryController.create
);
app.post("/items", verifyToken, checkRole("ADMIN"), itemController.create);

// Leitura do Catálogo pode ser pública ou autenticada (Deixamos pública para simular a vitrine)
app.get("/categories", categoryController.findAll);
app.get("/items", itemController.findAll);
app.get("/items/:id", itemController.findById);

app.put(
  "/categories/:id",
  verifyToken,
  checkRole("ADMIN"),
  categoryController.update
);
app.put("/items/:id", verifyToken, checkRole("ADMIN"), itemController.update);

app.delete(
  "/categories/:id",
  verifyToken,
  checkRole("ADMIN"),
  categoryController.delete
);
app.delete(
  "/items/:id",
  verifyToken,
  checkRole("ADMIN"),
  itemController.delete
);

// --- ROTAS DE ENDEREÇO (ADDRESS) ---
// Endereço sempre é ligado a um usuário, exige login
app.post("/users/:userId/address", verifyToken, addressController.upsert);
app.put("/users/:userId/address", verifyToken, addressController.upsert);
app.get("/users/:userId/address", verifyToken, addressController.findByUserId);
app.delete(
  "/users/:userId/address",
  verifyToken,
  addressController.deleteByUserId
);

// --- ROTAS DE PEDIDOS (ORDER) ---
// Criação e leitura exigem login
app.post("/orders", verifyToken, orderController.create);
app.get("/orders/:id", verifyToken, orderController.findById);
app.get("/users/:userId/orders", verifyToken, orderController.findByUserId);

// Atualizar Status é tarefa ADMIN (Ex: de PENDENTE para EM_PREPARACAO)
app.put(
  "/orders/:id/status",
  verifyToken,
  checkRole("ADMIN"),
  orderController.updateStatus
);

// --- FIM DAS ROTAS CRUD ---

// 4. Faz o servidor escutar na porta 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log("Use Ctrl+C para parar o servidor.");
});
