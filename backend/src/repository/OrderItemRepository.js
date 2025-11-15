// backend/src/repository/OrderItemRepository.js

const prisma = require("../config/prisma.js");

class OrderItemRepository {
  /**
   * [CREATE MANY] Cria múltiplos itens de pedido em lote.
   * @param {BigInt} orderId - O ID do pedido ao qual os itens pertencem.
   * @param {Array<Object>} items - Lista de objetos { itemId, quantity }.
   * @returns {Promise<Object>} Retorna a contagem de itens criados.
   */
  async createMany(orderId, items) {
    // Mapeia a lista de itens para o formato de dados do Prisma.
    const data = items.map((item) => ({
      orderId: orderId,
      itemId: BigInt(item.itemId),
      quantity: item.quantity,
    }));

    // Usa createMany para inserir todos os itens de uma vez.
    // Nota: createMany não retorna os registros criados, apenas a contagem.
    return prisma.orderitem.createMany({
      data: data,
      skipDuplicates: true, // Opcional, dependendo da sua regra de negócio
    });
  }

  /**
   * [READ ALL] Busca todos os itens de um pedido específico.
   * @param {string} orderId - O ID do pedido.
   */
  async findByOrderId(orderId) {
    return prisma.orderitem.findMany({
      where: {
        orderId: BigInt(orderId),
      },
      // Inclui o nome e preço unitário do item (produto) original
      include: {
        item: {
          select: {
            description: true,
            unitPrice: true,
          },
        },
      },
    });
  }

  // Não precisamos de métodos update/delete separados, pois serão tratados
  // pelo CRUD do pedido (OrderRepository).
}

module.exports = new OrderItemRepository();
