const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    // Adicionar suporte para arquivos SVG
    assetExts: getDefaultConfig(__dirname).resolver.assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...getDefaultConfig(__dirname).resolver.sourceExts, 'svg'],

    // Definindo o caminho base para resolver os módulos a partir de 'src'
    alias: {
      components: path.resolve(__dirname, 'src/components'),
      assets: path.resolve(__dirname, 'src/assets'),
      utils: path.resolve(__dirname, 'src/utils'),
      navigations: path.resolve(__dirname, 'src/navigations'),
    },
  },
};

// Mescla a configuração padrão com a personalizada
module.exports = mergeConfig(getDefaultConfig(__dirname), config);
