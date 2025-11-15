// Adiciona a função toJSON ao protótipo BigInt
// Isso permite que JSON.stringify() converta BigInts para strings.
BigInt.prototype.toJSON = function () {
  return this.toString();
};

// Opcional: exporta uma função dummy ou nada, se você apenas quiser que seja executado.
module.exports = true;
