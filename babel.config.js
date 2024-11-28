module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    '@babel/plugin-transform-export-namespace-from',
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['./src'], // Aponte para a pasta "src" como raiz do projeto.
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.android.js', '.android.tsx', '.ios.js', '.ios.tsx'],
        alias: {
          assets: './src/assets',
          component: './src/component',
          config: './src/config',
          context_realm: './src/context_realm',
          navigations: './src/navigations',
          operations: './src/operations',
          routes: './src/routes',
          services: './src/services',
          styles: './src/styles',
          types: './src/types',
          util: './src/util',
        },
      },
    ],
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env.api',
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true,
        relativeSourceLocation: true,
      },
    ],
  ],
};
