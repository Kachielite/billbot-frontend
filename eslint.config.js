const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier/flat');

module.exports = defineConfig([
  {
    ignores: ['.expo/**', 'android/**', 'ios/**', 'node_modules/**', 'eslint.config.js'],
  },
  expoConfig,
  prettierConfig,
]);
