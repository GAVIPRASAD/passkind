import theme from "./src/config/theme.js";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Enable dark mode via class
  theme: {
    extend: {
      colors: {
        // Theme colors from centralized config
        ocean: theme.primary,
        deep: theme.secondary,
      },
      backgroundImage: {
        "gradient-ocean": theme.gradients.primary,
        "gradient-ocean-hover": theme.gradients.primaryHover,
        "gradient-accent": theme.gradients.accent,
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
      },
      transitionDuration: {
        fast: theme.animations.duration.fast,
        normal: theme.animations.duration.normal,
        slow: theme.animations.duration.slow,
      },
      transitionTimingFunction: {
        theme: theme.animations.easing,
      },
      animation: {
        gradient: "gradient 3s ease infinite",
        blob: "blob 7s infinite",
      },
      keyframes: {
        gradient: {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
    },
  },
  plugins: [],
};
