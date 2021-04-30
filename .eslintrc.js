module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "globals": {
    buildEnv: true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
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
  "rules": {
    "no-unused-vars": "warn",
    "react-hooks/rules-of-hooks": "error",      // 检查 Hook 的规则
    "react-hooks/exhaustive-deps": "warn",
  }
}