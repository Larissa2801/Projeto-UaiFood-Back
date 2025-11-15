// backend/src/repository/ItemRepository.js

const prisma = require("../config/prisma.js");

class ItemRepository {
  // [CREATE] Cria um novo item
  async create(itemData) {
    // Garante que unitPrice é Float e categoryId é BigInt (Prisma faz a conversão de string)
    return prisma.item.create({
      data: {
        description: itemData.description,
        unitPrice: parseFloat(itemData.unitPrice), // Garante que é um número
        categoryId: BigInt(itemData.categoryId), // Garante que é um BigInt para a FK
      },
      // Inclui a Categoria para retornar o nome junto com o item
      include: {
        category: {
          select: {
            description: true,
          },
        },
      },
    });
  }

  // [READ ALL] Busca todos os itens e inclui a categoria
  async findAll() {
    return prisma.item.findMany({
      include: {
        category: {
          select: {
            description: true,
          },
        },
      },
    });
  }

  // [READ ONE] Busca um item por ID
  async findById(id) {
    return prisma.item.findUnique({
      where: {
        id: BigInt(id),
      },
      include: {
        category: {
          select: {
            description: true,
          },
        },
      },
    });
  }

  // [UPDATE] Atualiza um item por ID
  async update(id, itemData) {
    // Converte unitPrice e categoryId (se estiverem presentes)
    const dataToUpdate = {
      ...itemData,
      ...(itemData.unitPrice && { unitPrice: parseFloat(itemData.unitPrice) }),
      ...(itemData.categoryId && { categoryId: BigInt(itemData.categoryId) }),
    };

    return prisma.item.update({
      where: {
        id: BigInt(id),
      },
      data: dataToUpdate,
      include: {
        category: {
          select: {
            description: true,
          },
        },
      },
    });
  }

  // [DELETE] Deleta um item por ID
  async delete(id) {
    return prisma.item.delete({
      where: {
        id: BigInt(id),
      },
    });
  }
}

module.exports = new ItemRepository();
