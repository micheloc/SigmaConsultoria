// .eslintrc.cjs (ou .eslintrc.js)
module.exports = [
  // Configurações recomendadas
  {
    languageOptions: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true, // para suporte a JSX
        },
      },
      globals: {
        browser: true,
        node: true,
      },
    },
    plugins: ['react', '@typescript-eslint', 'import', 'prettier'],
    rules: {
      'no-console': 'off',
      indent: ['error', 2],
      'no-empty-function': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/camelcase': 'off',
      'react/self-closing-comp': 'error',
      'prettier/prettier': [
        'error',
        {
          tabWidth: 2,
          singleQuote: true,
          trailingComma: 'all',
          arrowParens: 'always',
          endOfLine: 'auto',
        },
      ],
      'import/no-unused-vars': 'off',
      'import/no-unresolved': 'off',
      'import/no-named-as-default': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-unused-vars': 'off',
      'no-useless-escape': 'off',
      'prefer-const': 'off',
      'no-const-assign': 'error',
      'react/no-unknown-property': 'error',
    },
    ignorePatterns: ['node_modules'],
  },
  // Configurações adicionais de plugins
  'eslint:recommended',
  'plugin:react/recommended',
  'plugin:@typescript-eslint/recommended',
  'plugin:import/errors',
  'plugin:import/warnings',
  'prettier',
];
