// backend/src/middlewares/validationMiddleware.js
const { z } = require("zod");

const validationMiddleware = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync(req.body);
    next();
  } catch (error) {
    console.error("Erro na validação:", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = validationMiddleware;
