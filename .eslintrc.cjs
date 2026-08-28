module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["airbnb", "airbnb/hooks"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/jsx-filename-extension": ["warn", { extensions: [".js", ".jsx"] }],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
      },
    ],
    "no-param-reassign": [
      "error",
      {
        props: true,
        ignorePropertyModificationsFor: ["state"],
      },
    ],
    "react/require-default-props": "off",
  },
};
