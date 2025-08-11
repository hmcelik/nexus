module.exports = {
  root: false,
  env: { es2022: true, node: true, browser: true },
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  extends: ['eslint:recommended', 'plugin:import/recommended', 'prettier'],
  plugins: ['unused-imports'],
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'import/order': [
      'warn',
      {
        groups: [['builtin', 'external', 'internal'], ['parent', 'sibling', 'index']],
        'newlines-between': 'always'
      }
    ],
    'unused-imports/no-unused-imports': 'error'
  },
  settings: { 'import/resolver': { node: true, typescript: true } }
}