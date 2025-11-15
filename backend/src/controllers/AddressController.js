// backend/src/controllers/AddressController.js

const addressRepository = require("../repository/AddressRepository");

class AddressController {
  // [CREATE/UPDATE] POST /users/:userId/address
  async upsert(req, res) {
    const { userId } = req.params;
    const addressData = req.body;

    try {
      // O upsert é chamado aqui.
      const address = await addressRepository.upsert(userId, addressData);
      return res.status(201).json(address);
    } catch (error) {
      // P2003: Foreign key constraint (userId não existe)
      // P2025: Usuário não encontrado no update (se usasse findUnique/update)
      if (error.code === "P2003") {
        return res
          .status(404)
          .json({
            error:
              "Usuário não encontrado. Não foi possível vincular o endereço.",
          });
      }
      console.error("Erro ao salvar endereço:", error);
      return res
        .status(500)
        .json({ error: "Falha interna ao salvar endereço." });
    }
  }

  // [READ ONE] GET /users/:userId/address
  async findByUserId(req, res) {
    const { userId } = req.params;
    try {
      const address = await addressRepository.findByUserId(userId);

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

  // [DELETE] DELETE /users/:userId/address
  async deleteByUserId(req, res) {
    const { userId } = req.params;
    try {
      const deletedAddress = await addressRepository.deleteByUserId(userId);
      return res.status(200).json(deletedAddress);
    } catch (error) {
      // P2025: Endereço não encontrado para deletar
      if (error.code === "P2025") {
        return res
          .status(404)
          .json({ error: "Endereço não encontrado para este usuário." });
      }
      console.error("Erro ao deletar endereço:", error);
      return res
        .status(500)
        .json({ error: "Falha interna ao deletar endereço." });
    }
  }
}

module.exports = new AddressController();
