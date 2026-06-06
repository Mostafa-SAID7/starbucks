/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        /* ── Starbucks brand — single source, use these in templates ── */
        'sb-green': '#006241',
        'sb-dark':  '#1e3932',
        'sb-gold':  '#cba258',

        /* ── Extended brand palette ─────────────────────────────────── */
        starbucks: {
          green:                '#006241',
          dark:                 '#1e3932',
          gold:                 '#cba258',
          'card-green-light':   '#d4e9e2',
          'card-neutral-light': '#f2f0eb',
        },
      },
      fontFamily: {
        sans:     ['Noto Sans Arabic', 'system-ui', 'sans-serif'],
        heading:  ['Cairo', 'serif'],
        branding: ['Cairo', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'card':      '0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'card-hover':'0 4px 24px 0 rgba(0,98,65,0.08), 0 1px 4px 0 rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
};
