// .eslintrc.cjs
module.exports = {
  env: {
    es2021: true,
    node: true,
    browser: false
  },
  extends: ["eslint:recommended", "prettier"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "script"
  },
  rules: {
    // Gentle defaults — tweak as you like
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    "no-console": "off"
  },
  overrides: [
    {
      files: [".eleventy.js"],
      env: {
        node: true
      }
    }
  ]
};
