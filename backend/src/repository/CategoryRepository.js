const prisma = require("../config/prisma.js");

class CategoryRepository {
  // [CREATE] Cria uma nova categoria
  async create(categoryData) {
    return prisma.category.create({
      data: {
        description: categoryData.description,
      },
    });
  }

  // [READ ALL] Busca todas as categorias
  async findAll() {
    return prisma.category.findMany();
  }

  // [READ ONE] Busca uma categoria por ID
  async findById(id) {
    return prisma.category.findUnique({
      where: {
        id: BigInt(id),
      },
    });
  }

  // [UPDATE] Atualiza uma categoria por ID
  async update(id, categoryData) {
    return prisma.category.update({
      where: {
        id: BigInt(id),
      },
      data: categoryData,
    });
  }

  // [DELETE] Deleta uma categoria por ID
  async delete(id) {
    return prisma.category.delete({
      where: {
        id: BigInt(id),
      },
    });
  }
}

module.exports = new CategoryRepository();
