module.exports = {
  root: true,
  parserOptions: {
    parser: "babel-eslint",
  },
  env: {
    node: true,
    browser: true,
  },
  extends: ["plugin:vue/vue3-essential", "eslint:recommended"],
  rules: {
    // allow async-await
    "space-before-function-paren": 0,
    "generator-star-spacing": "off",
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    semi: 0,
    "comma-dangle": 0,
    quotes: 0,

    // need to be resolved
    "vue/require-prop-type-constructor": "off",
    "vue/custom-event-name-casing": "off",
    "vue/no-use-v-if-with-v-for": "off",
  },
};
