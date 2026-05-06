/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "0.75rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "3rem",
        "2xl": "4rem",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Noto Sans Arabic", "Mada", "system-ui", "sans-serif"],
        heading: ["Noto Kufi Arabic", "Cairo", "serif"],
        branding: ["Cairo", "sans-serif"],
      },
      colors: {
        starbucks: {
          green: "#006241",
          dark: "#1e3932",
          gold: "#cba258",
        },
        background: {
          light: "#ffffff",
          dark: "#0f1419",
        },
        foreground: {
          light: "#1a1a1a",
          dark: "#e7e9ea",
        },
        card: {
          light: "#ffffff",
          dark: "#16181c",
        },
        border: {
          light: "#e5e7eb",
          dark: "#2f3336",
        },
      },
      keyframes: {
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -30px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "0.3", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(1.05)" },
        },
        "ping-slow": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
        "bounce-slow": {
          "0%, 100%": {
            transform: "translateY(0)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateY(-25%)",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
        "float-dot": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "25%": { transform: "translate(10px, -10px)" },
          "50%": { transform: "translate(-5px, -20px)" },
          "75%": { transform: "translate(-10px, -5px)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.2", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        },
      },
      animation: {
        "gradient-shift": "gradient-shift 15s ease infinite",
        float: "float 20s ease-in-out infinite",
        "float-delayed": "float 25s ease-in-out infinite",
        "pulse-slow": "pulse-slow 8s ease-in-out infinite",
        "pulse-slower": "pulse-slow 12s ease-in-out infinite",
        "ping-slow": "ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite",
        "ping-slower": "ping-slow 4s cubic-bezier(0, 0, 0.2, 1) infinite",
        "bounce-slow": "bounce-slow 3s infinite",
        "float-dot": "float-dot 8s ease-in-out infinite",
        twinkle: "twinkle 4s ease-in-out infinite",
        "twinkle-delayed": "twinkle 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
