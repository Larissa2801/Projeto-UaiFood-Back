// backend/src/controllers/AddressController.js
const addressService = require("../services/AddressService");
// Importar validation e schemas

class AddressController {
  // [READ ONE] - GET /users/:userId/address
  async findByUserId(req, res) {
    // O userId é o ID do usuário cujo endereço será buscado (pode ser diferente do logado)
    const { userId } = req.params;
    // currentUserId é o ID do usuário logado (req.userId do token)
    const currentUserId = req.userId;
    const currentUserType = req.userType;

    // REGRA DE SEGURANÇA: Usuário só busca o próprio endereço (a menos que seja ADMIN)
    if (currentUserType !== "ADMIN" && userId !== String(currentUserId)) {
      return res
        .status(403)
        .json({
          error:
            "Acesso negado: Você só pode visualizar o seu próprio endereço.",
        });
    }

    try {
      const address = await addressService.findByUserId(userId);
      if (!address) {
        return res
          .status(404)
          .json({ error: "Endereço não encontrado para este usuário." });
      }
      return res.status(200).json(address);
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
      return res
        .status(500)
        .json({ error: "Falha interna ao buscar endereço." });
    }
  }

  // [CREATE/UPDATE - UPSERT] - POST/PUT /users/:userId/address
  async upsert(req, res) {
    const { userId } = req.params;
    const currentUserId = req.userId;
    const currentUserType = req.userType;
    const addressData = req.body;

    // REGRA DE SEGURANÇA: Usuário só altera o próprio endereço (a menos que seja ADMIN)
    if (currentUserType !== "ADMIN" && userId !== String(currentUserId)) {
      return res
        .status(403)
        .json({
          error: "Acesso negado: Você só pode alterar o seu próprio endereço.",
        });
    }

    try {
      const result = await addressService.upsert(userId, addressData);
      // O upsert do Prisma retorna o resultado da operação (insert ou update)
      return res.status(200).json(result);
    } catch (error) {
      console.error("Erro ao salvar endereço:", error);
      return res
        .status(500)
        .json({ error: "Falha interna ao salvar endereço." });
    }
  }

  // [DELETE] - DELETE /users/:userId/address
  async delete(req, res) {
    const { userId } = req.params;
    const currentUserId = req.userId;
    const currentUserType = req.userType;

    // REGRA DE SEGURANÇA: Usuário só deleta o próprio endereço (a menos que seja ADMIN)
    if (currentUserType !== "ADMIN" && userId !== String(currentUserId)) {
      return res
        .status(403)
        .json({
          error: "Acesso negado: Você só pode deletar o seu próprio endereço.",
        });
    }

    try {
      const result = await addressService.delete(userId);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Erro ao deletar endereço:", error);
      return res
        .status(500)
        .json({ error: "Falha interna ao deletar endereço." });
    }
  }
}
module.exports = new AddressController();
