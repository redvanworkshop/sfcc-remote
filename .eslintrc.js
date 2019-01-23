module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  globals: {
    chrome: true,
    io: true
  },
  env: {
    browser: true
  },
  extends: 'standard',
  plugins: [
    'html'
  ],
  rules: {
    'arrow-parens': 0,
    'generator-star-spacing': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
