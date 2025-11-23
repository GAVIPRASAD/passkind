/**
 * Centralized Theme Configuration
 * Change colors here and they will reflect throughout the entire application
 */

export const theme = {
  // Theme Name
  name: "Ocean Depths",

  // Primary Colors (used for buttons, links, focus states)
  primary: {
    50: "#f0fdfa",
    100: "#ccfbf1",
    200: "#99f6e4",
    300: "#5eead4",
    400: "#2dd4bf",
    500: "#14b8a6",
    600: "#0d9488",
    700: "#0f766e",
    800: "#115e59",
    900: "#134e4a",
  },

  // Secondary Colors (used for accents, highlights)
  secondary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },

  // Gradient Definitions
  gradients: {
    primary: "linear-gradient(135deg, #1e40af 0%, #0d9488 100%)",
    primaryHover: "linear-gradient(135deg, #1d4ed8 0%, #0f766e 100%)",
    accent: "linear-gradient(135deg, #059669 0%, #06b6d4 100%)",
  },

  // Animation Settings
  animations: {
    duration: {
      fast: "150ms",
      normal: "200ms",
      slow: "300ms",
    },
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
};

/**
 * Alternative Theme Presets
 * Uncomment and use any of these to quickly switch themes
 */

// Cyberpunk Neon Theme
export const cyberpunkTheme = {
  name: "Cyberpunk Neon",
  primary: {
    50: "#faf5ff",
    100: "#f3e8ff",
    200: "#e9d5ff",
    300: "#d8b4fe",
    400: "#c084fc",
    500: "#a855f7",
    600: "#9333ea",
    700: "#7e22ce",
    800: "#6b21a8",
    900: "#581c87",
  },
  secondary: {
    50: "#fdf4ff",
    100: "#fae8ff",
    200: "#f5d0fe",
    300: "#f0abfc",
    400: "#e879f9",
    500: "#d946ef",
    600: "#c026d3",
    700: "#a21caf",
    800: "#86198f",
    900: "#701a75",
  },
  gradients: {
    primary: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
    primaryHover: "linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)",
    accent: "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)",
  },
};

// Sunset Glow Theme
export const sunsetTheme = {
  name: "Sunset Glow",
  primary: {
    50: "#fff7ed",
    100: "#ffedd5",
    200: "#fed7aa",
    300: "#fdba74",
    400: "#fb923c",
    500: "#f97316",
    600: "#ea580c",
    700: "#c2410c",
    800: "#9a3412",
    900: "#7c2d12",
  },
  secondary: {
    50: "#fff1f2",
    100: "#ffe4e6",
    200: "#fecdd3",
    300: "#fda4af",
    400: "#fb7185",
    500: "#f43f5e",
    600: "#e11d48",
    700: "#be123c",
    800: "#9f1239",
    900: "#881337",
  },
  gradients: {
    primary: "linear-gradient(135deg, #F97316 0%, #F43F5E 100%)",
    primaryHover: "linear-gradient(135deg, #EA580C 0%, #E11D48 100%)",
    accent: "linear-gradient(135deg, #F59E0B 0%, #FB7185 100%)",
  },
};

// Forest Mystique Theme
export const forestTheme = {
  name: "Forest Mystique",
  primary: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
  },
  secondary: {
    50: "#f0fdfa",
    100: "#ccfbf1",
    200: "#99f6e4",
    300: "#5eead4",
    400: "#2dd4bf",
    500: "#14b8a6",
    600: "#0d9488",
    700: "#0f766e",
    800: "#115e59",
    900: "#134e4a",
  },
  gradients: {
    primary: "linear-gradient(135deg, #059669 0%, #84CC16 100%)",
    primaryHover: "linear-gradient(135deg, #047857 0%, #65A30D 100%)",
    accent: "linear-gradient(135deg, #10B981 0%, #14B8A6 100%)",
  },
};

export default theme;
