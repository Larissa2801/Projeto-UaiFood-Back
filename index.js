// index.js (CÓDIGO FINAL COM ORDEM DE ROTEAMENTO AJUSTADA)

require("./backend/src/utils/jsonSerializer");
require("dotenv").config();

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");

// --- Importações de Middlewares e Configurações ---
const validation = require("./backend/src/middlewares/validationMiddleware");
const { loginSchema } = require("./backend/src/schemas/validationSchemas");
const authController = require("./backend/src/controllers/AuthController");
const swaggerDocs = require("./backend/src/config/swaggerConfig");

// --- Importações dos Módulos de Rotas (Routers) ---
const userRoutes = require("./backend/src/routes/userRoutes");
const categoryRoutes = require("./backend/src/routes/categoryRoutes");
const itemRoutes = require("./backend/src/routes/itemRoutes");
const orderRoutes = require("./backend/src/routes/orderRoutes");
const addressRoutes = require("./backend/src/routes/addressRoutes");
// Não importamos o addressRoutes diretamente, pois ele é ANINHADO no userRoutes.

// --- Configurações e Inicializações ---
const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares Globais ---

app.use(cors());
app.use(express.json());

// 3. Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// --- Rotas Públicas e Raiz ---

// Rota GET no caminho raiz (/)
app.get("/", (req, res) => {
  res.send("Bem-vindo ao Laboratório de Rotas de DAW-II");
});

// --- REGISTRO DAS ROTAS MODULARIZADAS ---

// 1. ROTA DE AUTENTICAÇÃO (MANTIDA aqui por ser crítica e simples)
app.post("/login", validation(loginSchema), authController.login);

// 2. Rotas de Usuário
app.use("/users", userRoutes);

// 2.1 Rota ANINHADA de Endereço (Ligada ao Usuário)
// A rota /users/:userId/address agora é possível graças ao mergeParams no addressRoutes.js
app.use("/users/:userId/address", addressRoutes); // <--- ANINHADA

// 3. Rotas de Catálogo
app.use("/categories", categoryRoutes);
app.use("/items", itemRoutes);

// 4. Rotas de Pedido
app.use("/orders", orderRoutes);

// --- Inicialização do Servidor ---

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Documentação Swagger em http://localhost:${PORT}/api-docs`);
});
