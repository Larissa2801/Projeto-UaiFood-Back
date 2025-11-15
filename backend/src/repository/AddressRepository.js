// backend/src/repository/AddressRepository.js

const prisma = require("../config/prisma.js");

class AddressRepository {
  // [CREATE/UPDATE] Usa upsert para criar ou atualizar um endereço
  async upsert(userId, addressData) {
    const idBigInt = BigInt(userId);

    // Remove userId de addressData para evitar problemas de atualização
    const { userId: _, ...data } = addressData;

    return prisma.address.upsert({
      where: {
        userId: idBigInt, // Condição para buscar o endereço existente
      },
      update: {
        ...data,
        // O campo updatedAt será atualizado automaticamente pelo @updatedAt no schema
      },
      create: {
        ...data,
        userId: idBigInt, // Garante que o userId é incluído na criação
      },
      // Incluir o usuário (opcional, mas útil para validação)
      include: {
        user: {
          select: { name: true, phone: true },
        },
      },
    });
  }

  // [READ ONE] Busca endereço pelo ID do USUÁRIO (mais comum)
  async findByUserId(userId) {
    return prisma.address.findUnique({
      where: {
        userId: BigInt(userId),
      },
    });
  }

  // [DELETE] Deleta endereço pelo ID do USUÁRIO
  async deleteByUserId(userId) {
    return prisma.address.delete({
      where: {
        userId: BigInt(userId),
      },
    });
  }
}

module.exports = new AddressRepository();
