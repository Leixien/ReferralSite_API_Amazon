/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        amazon: {
          orange: '#FF9900',
          dark: '#232F3E',
          light: '#37475A',
        },
        price: {
          red: '#B12704',
        },
        prime: {
          blue: '#00A8E1',
        },
        discount: {
          red: '#CC0C39',
        },
      },
    },
  },
  plugins: [],
};
