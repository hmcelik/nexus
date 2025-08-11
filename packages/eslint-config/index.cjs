const js = require('@eslint/js')

module.exports = {
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    globals: {
      ...require('globals').node,
      ...require('globals').browser,
      ...require('globals').es2022
    }
  },
  plugins: {
    'unused-imports': require('eslint-plugin-unused-imports'),
    import: require('eslint-plugin-import')
  },
  rules: {
    ...js.configs.recommended.rules,
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
  settings: { 
    'import/resolver': { 
      node: true, 
      typescript: true 
    } 
  }
}