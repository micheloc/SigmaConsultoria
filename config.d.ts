declare module 'react-native-dotenv' {
  export const API_URL: string;
}

declare module '@env' {
  export const API_URL: string;
  export const API_KEY: string;
  // Adicione outras variáveis de ambiente que você esteja usando
}

// src/types/svg.d.ts
declare module '*.svg' {
  const content: string;
  export default content;
}

declare module 'react-native-vector-icons';
