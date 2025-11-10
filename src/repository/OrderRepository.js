// backend/src/repository/OrderRepository.js

const prisma = require("../config/prisma.js");
const orderItemRepository = require("./OrderItemRepository"); // Dependência

class OrderRepository {
  /**
   * [CREATE] Cria um pedido e todos os seus itens em uma transação.
   * @param {Object} orderData - Dados do pedido (paymentMethod, status, userClient, items).
   */
  async create(orderData) {
    // 1. Desestrutura dados do pedido e os itens
    const { userClient, paymentMethod, items, status } = orderData;
    const userClientBigInt = BigInt(userClient);

    // Define o status padrão se não for fornecido (exemplo)
    const orderStatus = status || "PENDING";

    try {
      // 2. Inicia a transação
      const [newOrder] = await prisma.$transaction([
        // 2.1. Cria o Pedido principal
        prisma.order.create({
          data: {
            userClient: userClientBigInt,
            paymentMethod: paymentMethod, // Deve ser um valor do ENUM (CASH, PIX, etc.)
            status: orderStatus,
          },
          // Seleciona o que será retornado
          select: {
            id: true,
            paymentMethod: true,
            status: true,
            userClient: true,
            createdAt: true,
          },
        }),
      ]);

      // 3. Verifica se o pedido foi criado e se há itens
      if (!newOrder) {
        // Embora o $transaction reverta em caso de falha, é bom ter uma checagem
        throw new Error("Falha ao criar o pedido principal.");
      }

      // 4. Cria os itens do pedido usando o OrderItemRepository
      const itemsResult = await orderItemRepository.createMany(
        newOrder.id,
        items
      );

      // 5. Se tudo deu certo, busca o pedido completo com seus itens
      const completeOrder = await this.findById(newOrder.id);

      return completeOrder;
    } catch (error) {
      // Se algo falhar (incluindo createMany), o $transaction garante o rollback
      throw error;
    }
  }

  /**
   * [READ ONE] Busca um pedido pelo ID, incluindo seus itens e a descrição do produto.
   */
  async findById(id) {
    return prisma.order.findUnique({
      where: {
        id: BigInt(id),
      },
      include: {
        // Inclui a lista de orderitem
        orderitem: {
          select: {
            quantity: true,
            // Inclui o item original (produto)
            item: {
              select: {
                id: true,
                description: true,
                unitPrice: true,
              },
            },
          },
        },
        // Inclui o usuário que fez o pedido
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
    });
  }

  /**
   * [READ ALL] Busca o histórico de pedidos de um usuário.
   */
  async findByUserId(userId) {
    return prisma.order.findMany({
      where: {
        userClient: BigInt(userId),
      },
      orderBy: {
        createdAt: "desc",
      },
      // Inclui informações essenciais para o histórico
      include: {
        orderitem: {
          select: {
            quantity: true,
            item: {
              select: { description: true, unitPrice: true },
            },
          },
        },
      },
    });
  }

  /**
   * [UPDATE] Atualiza o status do pedido.
   */
  async updateStatus(id, newStatus) {
    return prisma.order.update({
      where: {
        id: BigInt(id),
      },
      data: {
        status: newStatus,
      },
      select: {
        id: true,
        status: true,
        updatedAt: true,
      },
    });
  }

  // Não implementaremos o DELETE, pois deletar um pedido geralmente
  // é uma operação restrita ou de exclusão suave (soft delete).
}

module.exports = new OrderRepository();
