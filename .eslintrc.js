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
  plugins: [
    'vue'
  ],
  rules: {
    // eslint 缩进两空格（switch case两空格）
    'indent': ['error', 2, { SwitchCase: 1 }],
    // 对象属性名可使用字符串
    'quote-props': ['error', 'consistent'],
    // vue html 缩进两空格
    'vue/html-indent': ['error', 2],
    // vue script 缩进两空格
    'vue/script-indent': ['error', 2, { baseIndent: 1 }],
    // vue 单行最多运行3个属性，多行每行一个
    'vue/max-attributes-per-line': ['error', {
      singleline: 3,
      multiline: {
        max: 1,
        allowFirstLine: false
      }
    }]
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
