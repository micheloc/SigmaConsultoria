// Função para converter Base64 para Array de Bytes
function base64ToBytes(base64: string): Uint8Array {
  const binaryString = atob(base64); // Decodifica Base64 em uma string binária
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i); // Converte cada caractere para um byte
  }
  return bytes;
}

export default base64ToBytes;
