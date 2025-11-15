// backend/src/services/CategoryService.js
const categoryRepository = require("../repository/CategoryRepository");

class CategoryService {
  async create(userData) {
    return categoryRepository.create(userData);
  }
  async findAll() {
    return categoryRepository.findAll();
  }
  async findById(id) {
    return categoryRepository.findById(id);
  }
  async update(id, userData) {
    // Lógica de negócio futura, se houver
    return categoryRepository.update(id, userData);
  }
  async delete(id) {
    return categoryRepository.delete(id);
  }
}
module.exports = new CategoryService();
