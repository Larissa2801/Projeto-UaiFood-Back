// backend/src/services/ItemService.js
const itemRepository = require("../repository/ItemRepository");

class ItemService {
  async create(userData) {
    // Lógica de Estoque: Verificar se o item tem estoque inicial (Pós-futuro)
    return itemRepository.create(userData);
  }
  async findAll() {
    return itemRepository.findAll();
  }
  async findById(id) {
    return itemRepository.findById(id);
  }
  async update(id, userData) {
    // Bloqueio de campos de metadados viria aqui
    return itemRepository.update(id, userData);
  }
  async delete(id) {
    return itemRepository.delete(id);
  }
}
module.exports = new ItemService();
