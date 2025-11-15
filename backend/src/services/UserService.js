// backend/src/services/UserService.js

// backend/src/services/UserService.js

const userRepository = require("../repository/UserRepository");
const { userUpdateSchema } = require("../schemas/validationSchemas");
const bcrypt = require("bcrypt");
const saltRounds = 10;

class UserService {
  // ----------------------------------------------------
  // LÓGICA DE NEGÓCIO E SEGURANÇA (P2)
  // ----------------------------------------------------

  async create(userData) {
    if (!userData.consent) {
      // Lançamos um erro específico que pode ser mapeado no Controller
      throw new Error(
        "Consentimento: É obrigatório aceitar os termos de privacidade."
      );
    }
    return userRepository.create(userData);
  }

  async findAll() {
    return userRepository.findAll();
  }

  async findById(id) {
    return userRepository.findById(id);
  }

  /**
   * [UPDATE] Implementa o Bloqueio de Campos e Autorização
   */
  async update(userId, currentUserId, currentUserType, userData) {
    // 1. Somente ADMIN pode alterar userType
    if (userData.userType && currentUserType !== "ADMIN") {
      throw new Error("ADMIN_REQUIRED_TO_CHANGE_TYPE");
    }

    // 2. Usuário comum só pode alterar o próprio perfil
    if (
      currentUserType !== "ADMIN" &&
      String(userId) !== String(currentUserId)
    ) {
      throw new Error("ACCESS_DENIED_SELF_UPDATE_ONLY");
    }

    // 3. Cria objeto seguro de atualização
    const dataToUpdate = { ...userData };

    // 4. Re-hash da senha se necessário
    if (dataToUpdate.password) {
      dataToUpdate.password = await bcrypt.hash(
        dataToUpdate.password,
        saltRounds
      );
    }

    // 5. Impede alteração de campos sensíveis
    delete dataToUpdate.id;
    delete dataToUpdate.createdAt;
    delete dataToUpdate.updatedAt;

    // 6. Chama o repositório
    return userRepository.update(userId, dataToUpdate);
  }

  /**
   * [DELETE] Implementa a Autorização
   */
  async delete(userId, currentUserType) {
    // REGRA: A autorização principal já está no middleware, mas esta é a camada de segurança do serviço.
    if (currentUserType !== "ADMIN") {
      throw new Error("Usuário não autorizado a deletar.");
    }
    return userRepository.delete(userId);
  }
}

module.exports = new UserService();
