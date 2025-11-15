// backend/src/controllers/ItemController.js

const itemRepository = require("../repository/ItemRepository");

class ItemController {
  // [CREATE] POST /items
  async create(req, res) {
    try {
      const newItem = await itemRepository.create(req.body);
      return res.status(201).json(newItem);
    } catch (error) {
      // Erro comum: foreign key (categoryId) não existe
      if (error.code === "P2003") {
        return res
          .status(400)
          .json({ error: "O categoryId fornecido não existe." });
      }
      console.error("Erro ao criar item:", error);
      return res.status(500).json({ error: "Falha interna ao criar item." });
    }
  }

  // [READ ALL] GET /items
  async findAll(req, res) {
    try {
      const items = await itemRepository.findAll();
      return res.status(200).json(items);
    } catch (error) {
      console.error("Erro ao buscar itens:", error);
      return res.status(500).json({ error: "Falha interna ao buscar itens." });
    }
  }

  // [READ ONE] GET /items/:id
  async findById(req, res) {
    const { id } = req.params;
    try {
      const item = await itemRepository.findById(id);
      if (!item) {
        return res.status(404).json({ error: "Item não encontrado." });
      }
      return res.status(200).json(item);
    } catch (error) {
      console.error("Erro ao buscar item:", error);
      return res.status(500).json({ error: "Falha interna ao buscar item." });
    }
  }

  // [UPDATE] PUT /items/:id
  async update(req, res) {
    const { id } = req.params;
    try {
      const updatedItem = await itemRepository.update(id, req.body);
      return res.status(200).json(updatedItem);
    } catch (error) {
      if (error.code === "P2003") {
        return res
          .status(400)
          .json({ error: "O categoryId fornecido não existe." });
      }
      console.error("Erro ao atualizar item:", error);
      return res
        .status(500)
        .json({ error: "Falha interna ao atualizar item. O ID existe?" });
    }
  }

  // [DELETE] DELETE /items/:id
  async delete(req, res) {
    const { id } = req.params;
    try {
      const deletedItem = await itemRepository.delete(id);
      return res.status(200).json(deletedItem);
    } catch (error) {
      console.error("Erro ao deletar item:", error);
      return res
        .status(500)
        .json({ error: "Falha interna ao deletar item. O ID existe?" });
    }
  }
}

module.exports = new ItemController();
