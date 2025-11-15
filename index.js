// index.js (Versão Corrigida para Roteamento)

require("./backend/src/utils/jsonSerializer");
require("dotenv").config();

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");

// --- IMPORTAÇÕES DE MÓDULOS DE ROTAS ---
const userController = require("./backend/src/controllers/UserController");
const authController = require("./backend/src/controllers/AuthController"); // Importado para uso direto na rota /login
const validation = require("./backend/src/middlewares/validationMiddleware"); // Importado para uso direto na rota /login
const { loginSchema } = require("./backend/src/schemas/validationSchemas"); // Importado para uso direto na rota /login

// Importar configurações e módulos do backend
const swaggerDocs = require("./backend/src/config/swaggerConfig");
const userRoutes = require("./backend/src/routes/userRoutes");

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

// --- REGISTRO DAS ROTAS ESSENCIAIS (DIRETO NO INDEX) ---

// ROTA DE AUTENTICAÇÃO: REGISTRADA DIRETAMENTE NO APP.POST PARA RESOLVER O 404
// A rota /login agora é totalmente explícita no index.js
app.post("/login", validation(loginSchema), authController.login);

// 2. Rotas de Usuário (usando o router modularizado)
app.use("/users", userRoutes);

// ... (Outras rotas como /categories devem ser adicionadas aqui quando você modularizá-las)

// --- Inicialização do Servidor ---

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Documentação Swagger em http://localhost:${PORT}/api-docs`);
});
