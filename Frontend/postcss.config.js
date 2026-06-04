export default {
  plugins: {
    // NOTE: @tailwindcss/postcss is intentionally omitted here.
    // Tailwind v4 CSS processing is handled by the @tailwindcss/vite plugin
    // in vite.config.ts. Using both simultaneously causes double-processing
    // and build failures on Vercel (Rolldown). Autoprefixer still runs fine.
    autoprefixer: {},
  },
};
