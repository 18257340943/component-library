module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "globals": {
    buildEnv: true,
    appName: true,
    process: true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  "parser": '@babel/eslint-parser',
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "react-hooks"
  ],
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "no-console": process.env.NODE_ENV === "production" ? "warning" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warning" : "off",
    "prefer-destructuring": 0,

    "prefer-const": 0,              // 禁用const 恶心规则
    "prefer-promise-reject-errors": 1,
    "no-else-return": 0,
    "import/no-extraneous-dependencies": 0,
    "import/no-unresolved": [2, { ignore: ["^@/"] }],       // 首行import 规则
    "react/jsx-props-no-spreading": 0,
    "react/jsx-one-expression-per-line": 0,
    "react/prop-types": 0,
    "react/forbid-prop-types": 0,
    "react/jsx-indent": 0,
    "react/jsx-closing-tag-location": 0,
    "react/jsx-closing-bracket-location": 0,
    "arrow-body-style": 0,
    "react/destructuring-assignment": 0, // 关闭权限校验
    "react/no-array-index-key": 0,    // index 不能设置key
    "react/no-children-prop": 0,      // 设置子元素
    "consistent-return": 0,           // 关闭函数校验
    "no-plusplus": 0,
    "no-lonely-if": 0,                // 合并为else if
    // "no-useless-escape": 0,        // 关闭正则校验
    "react/self-closing-comp": 0,     // react 自动闭合标签
    "react/jsx-wrap-multilines": [
      "error",
      {
        declaration: false,
        assignment: false,
      },
    ],
    "prefer-arrow-callback": 0,
    "no-unused-expressions": 0, // js三目运算符表达式
    "func-names": 0,
    "react/jsx-curly-newline": 0,
    "react/jsx-filename-extension": [
      1,
      {
        extensions: [".js", ".jsx"],
      },
    ],
    "jsx-a11y/no-noninteractive-element-interactions": 0,
    // class 里成员是否空行
    "lines-between-class-members": ["error", "always", { exceptAfterSingleLine: true }],
    // 禁止空语句块
    "no-empty": 1,
    "no-shadow": 0,
    "no-underscore-dangle": 0,
    // "no-useless-escape": "warning",
    camelcase: 1,
    "no-unused-vars": 1,
    "no-param-reassign": 0,
    "jsx-a11y/no-static-element-interactions": 0,
    "jsx-a11y/anchor-has-content": 0,
    "jsx-a11y/click-events-have-key-events": 0,
    "jsx-a11y/anchor-is-valid": 0,
    "import/no-unresolved": 0,       // 首行import 规则
    // 'jsx-closing-bracket-location': 0
    // 'comma-dangle': ['error', 'always-multiline'],
  },
}