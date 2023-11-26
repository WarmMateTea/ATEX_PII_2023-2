/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    "./views/*.{html,js}",
    "./*.{html,js}",
  ],
  theme: {
    extend: {
      colors: {
        BACKGROUND: {
          DAY: '#f4f0fe',
          NIGHT: '#05010e',
          ACCENT: '#f4f0fe'
        },
        TEXT: {
          DAY: '#0a0222',
          NIGHT: '#e5ddfd',
          ACCENT: '#f4f0fe',
        },
        PRIMARY: {
          DAY: '#2D1674',
        },
        SECONDARY: {
          DAY: '#d4c5fc',
          NIGHT: '#12033a',
        },
        ACCENT: {
          DAY: '#2d00a8',
          NIGHT: '#8457ff',
        },
      },
      fontFamily: {
        THEME: ['Poppins']
      }
    },
  },
  plugins: [],
}

