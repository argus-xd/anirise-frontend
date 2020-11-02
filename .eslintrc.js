module.exports = {
  root: true,
  parserOptions: {
    parser: "babel-eslint",
  },
  env: {
    browser: true,
  },
  extends: ["plugin:vue/essential", "standard"],
  plugins: ["vue"],
  rules: {
    // allow async-await
    "space-before-function-paren": 0,
    "generator-star-spacing": "off",
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    semi: 0,
    "comma-dangle": 0,
    quotes: 0,
  },
};
