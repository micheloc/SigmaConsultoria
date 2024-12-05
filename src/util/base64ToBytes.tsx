/**
 * Converte uma string em formato base64 para um array de bytes.
 *
 * @param {string} base64 - A string em formato base64 a ser convertida.
 * @returns {Uint8Array} Um array de bytes representando os dados binários da string base64.
 */
const base64ToBytes = (base64: string): Uint8Array => {
  // Decodifica a string base64 para uma string binária.
  const binaryString = window.atob(base64);
  // Obtém o comprimento da string binária.
  const binaryLen = binaryString.length;
  // Cria um array de bytes com o mesmo comprimento da string binária.
  const bytes = new Uint8Array(binaryLen);
  // Preenche o array de bytes com os valores ASCII de cada caractere da string binária.
  for (let i = 0; i < binaryLen; i++) {
    const ascii = binaryString.charCodeAt(i);
    bytes[i] = ascii;
  }
  // Retorna o array de bytes.
  return bytes;
};

// Exporta a função como padrão.
export default base64ToBytes;
