/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          deep: '#650000',
          dark: '#500000',
          light: '#7a0000',
        },
        crimson: '#A60000',
        gold: {
          light: '#FFE59A',
          DEFAULT: '#E5BD55',
          dark: '#C9A43E',
        },
        institutional: {
          black: '#080808',
          darkgrey: '#343434',
          border: '#DEDEDE',
          bg: '#F3F3F3',
          error: '#F37F84',
        }
      },
      fontFamily: {
        sans: ['"Lucida Sans Unicode Regular"', '"Lucida Sans Unicode"', '"Lucida Grande"', '"Lucida Sans"', 'Geneva', 'Verdana', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.08)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.14)',
        header: '0 2px 12px rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [],
}

