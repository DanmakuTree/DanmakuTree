module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    'plugin:vue/essential',
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: [
    'vue'
  ],
  rules: {
    // 缩进两空格（switch case两空格）
    indent: ['error', 2, { SwitchCase: 1 }],
    'vue/html-indent': ['error', 2],
    'vue/script-indent': ['error', 2, { baseIndent: 1 }]
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        // 解决vue缩进规则冲突
        indent: 'off'
      }
    }
  ]
}
