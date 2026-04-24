// postcss.config.cjs
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {}, // ← utilise le plugin officiel maintenant
    autoprefixer: {},
  },
};