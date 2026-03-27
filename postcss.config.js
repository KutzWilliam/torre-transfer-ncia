export default {
  plugins: {
    "@tailwindcss/postcss": {},
    "postcss-preset-env": {
      stage: 2,
      features: {
        "oklab-function": true,
        "color-function": true,
      }
    }
  },
};
