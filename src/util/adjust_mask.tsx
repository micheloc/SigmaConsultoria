/**
 * Formata um número de telefone com base no evento de mudança de um campo de entrada.
 * A formatação é aplicada de acordo com o comprimento do número inserido, diferenciando entre telefones fixos e celulares.
 *
 * @param {React.ChangeEvent<HTMLInputElement>} input - O evento de mudança do campo de entrada que contém o número de telefone.
 * @returns {string} O número de telefone formatado.
 */
export const formatPhoneNumber = (input: any): string => {
  // Remove todos os caracteres não numéricos da entrada.
  let cleanedInput: string = '';
  if (input.target) {
    cleanedInput = input.target.value.replace(/\D/g, '');
  } else {
    cleanedInput = input.replace(/\D/g, '');
  }

  switch (cleanedInput.length) {
    case 1:
      return cleanedInput.replace(/(\d{1})/, '$1');
    case 2:
      return cleanedInput.replace(/(\d{2})/, '($1');
    case 3:
      return cleanedInput.replace(/(\d{2})(\d{1})/, '($1) $2');
    case 4:
      return cleanedInput.replace(/(\d{2})(\d{2})/, '($1) $2');
    case 5:
      return cleanedInput.replace(/(\d{2})(\d{3})/, '($1) $2');
    case 6:
      return cleanedInput.replace(/(\d{2})(\d{4})/, '($1) $2');
    case 7:
      return cleanedInput.replace(/(\d{2})(\d{4})(\d{1})/, '($1) $2-$3');
    case 8:
      return cleanedInput.replace(/(\d{2})(\d{4})(\d{2})/, '($1) $2-$3');
    case 9:
      return cleanedInput.replace(/(\d{2})(\d{4})(\d{3})/, '($1) $2-$3');

    case 10:
      // Formatação para telefones fixos.
      return cleanedInput.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    case 11:
      // Formatação para celulares.
      return cleanedInput.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');
    default:
      // Retorna a entrada limpa se não corresponder a nenhum dos casos acima.
      return cleanedInput.replace(/(\d{1})/, '($1)');
  }
};

/**
 * Formata um CPF ou CNPJ com base no evento de mudança de um campo de entrada.
 * A formatação é aplicada de acordo com o comprimento do número inserido, diferenciando entre CPF e CNPJ.
 *
 * @param {React.ChangeEvent<HTMLInputElement>} input - O evento de mudança do campo de entrada que contém o CPF ou CNPJ.
 * @returns {string} O CPF ou CNPJ formatado.
 */
export const formatCPForCNPJ = (input: React.ChangeEvent<HTMLInputElement>): string => {
  // Remove todos os caracteres não numéricos da entrada.
  const cleanedInput = input.target.value.replace(/\D/g, '');

  // Formata o CPF ou CNPJ com base no comprimento da entrada limpa.
  switch (cleanedInput.length) {
    // Formata o CPF ou CNPJ com base no comprimento da entrada limpa.
    case 1:
      return cleanedInput.replace(/(\d{1})/, '$1');
    case 2:
      return cleanedInput.replace(/(\d{2})/, '$1');
    case 3:
      return cleanedInput.replace(/(\d{3})/, '$1');
    case 4:
      return cleanedInput.replace(/(\d{3})(\d{1})/, '$1.$2');
    case 5:
      return cleanedInput.replace(/(\d{3})(\d{2})/, '$1.$2');
    case 6:
      return cleanedInput.replace(/(\d{3})(\d{3})/, '$1.$2');
    case 7:
      return cleanedInput.replace(/(\d{3})(\d{3})(\d{1})/, '$1.$2.$3');
    case 8:
      return cleanedInput.replace(/(\d{3})(\d{3})(\d{2})/, '$1.$2.$3');
    case 9:
      return cleanedInput.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
    case 10:
      return cleanedInput.replace(/(\d{3})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
    case 11:
      // Formatação para CPF.
      return cleanedInput.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

    // Casos para 12 a 14 dígitos seguem o padrão de formatação para CNPJ.
    case 12:
      return cleanedInput.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/, '$1.$2.$3/$4');
    case 13:
      return cleanedInput.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{1})/, '$1.$2.$3/$4-$5');
    case 14:
      // Formatação para CNPJ.
      return cleanedInput.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    default:
      // Retorna a entrada limpa se não corresponder a nenhum dos casos acima.
      return cleanedInput;
  }
};

/**
 * Formata um CPF ou CNPJ com base no evento de mudança de um campo de entrada.
 * A formatação é aplicada de acordo com o comprimento do número inserido, diferenciando entre CPF e CNPJ.
 *
 * @param {React.ChangeEvent<HTMLInputElement>} input - O evento de mudança do campo de entrada que contém o CPF ou CNPJ.
 * @returns {string} O CPF ou CNPJ formatado.
 */
export const formatCPForCNPJString = (value: string): string => {
  // Remove todos os caracteres não numéricos da entrada.
  const cleanedInput = value.replace(/\D/g, '');

  // Formata o CPF ou CNPJ com base no comprimento da entrada limpa.
  switch (cleanedInput.length) {
    // Formata o CPF ou CNPJ com base no comprimento da entrada limpa.
    case 1:
      return cleanedInput.replace(/(\d{1})/, '$1');
    case 2:
      return cleanedInput.replace(/(\d{2})/, '$1');
    case 3:
      return cleanedInput.replace(/(\d{3})/, '$1');
    case 4:
      return cleanedInput.replace(/(\d{3})(\d{1})/, '$1.$2');
    case 5:
      return cleanedInput.replace(/(\d{3})(\d{2})/, '$1.$2');
    case 6:
      return cleanedInput.replace(/(\d{3})(\d{3})/, '$1.$2');
    case 7:
      return cleanedInput.replace(/(\d{3})(\d{3})(\d{1})/, '$1.$2.$3');
    case 8:
      return cleanedInput.replace(/(\d{3})(\d{3})(\d{2})/, '$1.$2.$3');
    case 9:
      return cleanedInput.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
    case 10:
      return cleanedInput.replace(/(\d{3})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
    case 11:
      // Formatação para CPF.
      return cleanedInput.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

    // Casos para 12 a 14 dígitos seguem o padrão de formatação para CNPJ.
    case 12:
      return cleanedInput.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/, '$1.$2.$3/$4');
    case 13:
      return cleanedInput.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{1})/, '$1.$2.$3/$4-$5');
    case 14:
      // Formatação para CNPJ.
      return cleanedInput.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    default:
      // Retorna a entrada limpa se não corresponder a nenhum dos casos acima.
      return cleanedInput;
  }
};

/**
 * Formata um número de telefone com base no evento de mudança de um campo de entrada.
 * A formatação é aplicada de acordo com o comprimento do número inserido, diferenciando entre telefones fixos e celulares.
 *
 * @param {string} value - O evento de mudança do campo de entrada que contém o número de telefone.
 * @returns {string} O número de telefone formatado.
 */
export const formatPhoneNumberTxt = (value: string): string => {
  // Remove todos os caracteres não numéricos da entrada.
  const cleanedInput: string = value.replace(/\D/g, '');

  switch (cleanedInput.length) {
    case 1:
      return cleanedInput.replace(/(\d{1})/, '($1)');
    case 2:
      return cleanedInput.replace(/(\d{2})/, '($1)');
    case 3:
      return cleanedInput.replace(/(\d{2})(\d{1})/, '($1) $2');
    case 4:
      return cleanedInput.replace(/(\d{2})(\d{2})/, '($1) $2');
    case 5:
      return cleanedInput.replace(/(\d{2})(\d{3})/, '($1) $2');
    case 6:
      return cleanedInput.replace(/(\d{2})(\d{4})/, '($1) $2');
    case 7:
      return cleanedInput.replace(/(\d{2})(\d{4})(\d{1})/, '($1) $2-$3');
    case 8:
      return cleanedInput.replace(/(\d{2})(\d{4})(\d{2})/, '($1) $2-$3');
    case 9:
      return cleanedInput.replace(/(\d{2})(\d{4})(\d{3})/, '($1) $2-$3');

    case 10:
      // Formatação para telefones fixos.
      return cleanedInput.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    case 11:
      // Formatação para celulares.
      return cleanedInput.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');
    default:
      // Retorna a entrada limpa se não corresponder a nenhum dos casos acima.
      return cleanedInput.replace(/(\d{1})/, '($1)');
  }
};

/**
 * Formata um número de telefone com base no evento de mudança de um campo de entrada.
 * A formatação é aplicada de acordo com o comprimento do número inserido, diferenciando entre telefones fixos e celulares.
 *
 * @param {string} value - O evento de mudança do campo de entrada que contém o número de telefone.
 * @returns {string} O número de telefone formatado.
 */
export const formatCEP = (value: string): string => {
  // Remove todos os caracteres não numéricos da entrada.
  const cleanedInput = value.replace(/\D/g, '');

  switch (cleanedInput.length) {
    case 1:
      return cleanedInput.replace(/(\d{1})/, '$1');
    case 2:
      return cleanedInput.replace(/(\d{2})/, '$1');
    case 3:
      return cleanedInput.replace(/(\d{2})(\d{1})/, '$1.$2');
    case 4:
      return cleanedInput.replace(/(\d{2})(\d{2})/, '$1.$2');
    case 5:
      return cleanedInput.replace(/(\d{2})(\d{3})/, '$1.$2');
    case 6:
      return cleanedInput.replace(/(\d{2})(\d{3})(\d{1})/, '$1.$2-$3');
    case 7:
      return cleanedInput.replace(/(\d{2})(\d{3})(\d{2})/, '$1.$2-$3');
    case 8:
      return cleanedInput.replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2-$3');
    default:
      // Retorna a entrada limpa se não corresponder a nenhum dos casos acima.
      return cleanedInput.replace(/(\d{1})/, '$1');
  }
};
