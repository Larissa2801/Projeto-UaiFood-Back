// backend/src/services/AddressService.js
const addressRepository = require("../repository/AddressRepository");

class AddressService {
  /**
   * Busca o endereço do usuário logado.
   * @param {string} userId - ID do usuário logado (usado para buscar o próprio endereço).
   */
  async findByUserId(userId) {
    // A lógica de negócio aqui é garantir que o Repository só busca o endereço do userId
    return addressRepository.findByUserId(userId);
  }

  /**
   * Cria ou atualiza um endereço (UPSERT).
   * @param {string} userId - ID do usuário logado (garante que ele só altera o próprio endereço).
   * @param {object} addressData - Dados do endereço.
   */
  async upsert(userId, addressData) {
    // Bloqueio de campos de metadados viria aqui
    // O Repository deve usar o userId no WHERE para garantir a segurança.
    return addressRepository.upsert(userId, addressData);
  }

  /**
   * Deleta o endereço do usuário logado.
   * @param {string} userId - ID do usuário logado (usado para deletar o próprio endereço).
   */
  async delete(userId) {
    // O Repository deve garantir que só o endereço do userId será deletado.
    return addressRepository.delete(userId);
  }
}
module.exports = new AddressService();
