// backend/src/controllers/OrderController.js

const orderRepository = require("../repository/OrderRepository");

class OrderController {
  // [CREATE] POST /orders
  async create(req, res) {
    try {
      // O body deve incluir userClient, paymentMethod, e a lista de items
      const newOrder = await orderRepository.create(req.body);
      return res.status(201).json(newOrder);
    } catch (error) {
      // Erros comuns aqui: userClient ou itemId não existem (Foreign Key)
      if (error.code === "P2003") {
        return res
          .status(400)
          .json({
            error:
              "Dados inválidos. Verifique se o userClient e todos os itemId existem.",
          });
      }
      console.error("Erro ao criar pedido:", error);
      return res.status(500).json({ error: "Falha interna ao criar pedido." });
    }
  }

  // [READ ONE] GET /orders/:id
  async findById(req, res) {
    const { id } = req.params;
    try {
      const order = await orderRepository.findById(id);

      if (!order) {
        return res.status(404).json({ error: "Pedido não encontrado." });
      }

      return res.status(200).json(order);
    } catch (error) {
      console.error("Erro ao buscar pedido:", error);
      return res.status(500).json({ error: "Falha interna ao buscar pedido." });
    }
  }

  // [READ ALL by User] GET /users/:userId/orders
  async findByUserId(req, res) {
    const { userId } = req.params;
    try {
      const orders = await orderRepository.findByUserId(userId);
      return res.status(200).json(orders);
    } catch (error) {
      console.error("Erro ao buscar pedidos do usuário:", error);
      return res
        .status(500)
        .json({ error: "Falha interna ao buscar pedidos do usuário." });
    }
  }

  // [UPDATE STATUS] PUT /orders/:id/status
  async updateStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body; // Espera-se um body: { "status": "EM_PREPARACAO" }

    if (!status) {
      return res
        .status(400)
        .json({ error: "O novo status é obrigatório no corpo da requisição." });
    }

    try {
      const updatedOrder = await orderRepository.updateStatus(
        id,
        status.toUpperCase()
      );
      return res.status(200).json(updatedOrder);
    } catch (error) {
      // P2025: Pedido não encontrado
      if (error.code === "P2025") {
        return res
          .status(404)
          .json({ error: "Pedido não encontrado para atualização." });
      }
      console.error("Erro ao atualizar status do pedido:", error);
      return res
        .status(500)
        .json({ error: "Falha interna ao atualizar status." });
    }
  }
}

module.exports = new OrderController();
