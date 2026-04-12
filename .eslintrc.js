module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: ['react', 'react-hooks'],
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  ignorePatterns: ['node_modules/', 'public/', '.cache/', 'lib/'],
  rules: {
    'no-console': 'off',
    'no-undef': 'off',
    'no-unused-vars': 'off',
    'react/display-name': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
