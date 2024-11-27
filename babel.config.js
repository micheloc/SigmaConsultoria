module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env.api', // Ajuste o caminho para o seu arquivo .env.api
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true,
        relativeSourceLocation: true,
      },
    ],
    '@babel/plugin-transform-export-namespace-from',
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['./src'], // Configurando a raiz para o diretório src
      },
    ],
  ],
};
