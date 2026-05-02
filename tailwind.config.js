/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Cairo', 'system-ui', 'sans-serif'],
      },
      colors: {
        starbucks: {
          green: '#006241',
          dark: '#1e3932',
          gold: '#cba258',
        },
        background: {
          light: '#ffffff',
          dark: '#0f1419',
        },
        foreground: {
          light: '#1a1a1a',
          dark: '#e7e9ea',
        },
        card: {
          light: '#ffffff',
          dark: '#16181c',
        },
        border: {
          light: '#e5e7eb',
          dark: '#2f3336',
        },
      },
    },
  },
  plugins: [],
}
