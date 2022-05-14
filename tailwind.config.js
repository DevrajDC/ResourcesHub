const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
  content: ['./src/pages/**/*.{ts,tsx,mdx}', './src/components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
