/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#006241', // Starbucks green - matching frontend
          600: '#004d33',
          700: '#003d26',
          800: '#002b1a',
          900: '#001a10',
        },
        starbucks: {
          green: '#006241',
          dark: '#1e3932',
          gold: '#cba258',
        },
      },
      fontFamily: {
        sans: ['Noto Sans Arabic', 'system-ui', 'sans-serif'],
        heading: ['Cairo', 'serif'],
        branding: ['Cairo', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
