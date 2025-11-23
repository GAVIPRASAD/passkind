# 🎨 Theme Configuration Guide

## Quick Start

All theme colors are now centralized in one file: **`src/config/theme.js`**

### How to Change the Theme

1. Open `src/config/theme.js`
2. Modify the colors in the `theme` object
3. Save the file
4. The changes will automatically reflect throughout the entire application!

## Current Theme: Ocean Depths

The current active theme uses:

- **Primary Colors**: Teal/Ocean tones (#0d9488 to #f0fdfa)
- **Secondary Colors**: Deep Blue tones (#1e40af to #eff6ff)
- **Gradients**: Deep Blue → Teal

## Switch to a Different Theme

### Option 1: Use a Preset Theme

We have 4 pre-configured themes ready to use:

1. **Ocean Depths** (Current) - Calming blues and teals
2. **Cyberpunk Neon** - Purple to pink gradients
3. **Sunset Glow** - Orange to pink warmth
4. **Forest Mystique** - Emerald to lime freshness

**To switch themes:**

In `src/config/theme.js`, change the default export:

```javascript
// Current (Ocean Depths)
export default theme;

// Switch to Cyberpunk Neon
export default cyberpunkTheme;

// Switch to Sunset Glow
export default sunsetTheme;

// Switch to Forest Mystique
export default forestTheme;
```

### Option 2: Create Your Own Theme

Copy this template and customize:

```javascript
export const myCustomTheme = {
  name: "My Custom Theme",

  primary: {
    50: "#...", // Lightest
    100: "#...",
    200: "#...",
    300: "#...",
    400: "#...",
    500: "#...", // Base color
    600: "#...",
    700: "#...",
    800: "#...",
    900: "#...", // Darkest
  },

  secondary: {
    // Same structure as primary
  },

  gradients: {
    primary: "linear-gradient(135deg, #START 0%, #END 100%)",
    primaryHover: "linear-gradient(135deg, #START 0%, #END 100%)",
    accent: "linear-gradient(135deg, #START 0%, #END 100%)",
  },
};

// Then export it as default
export default myCustomTheme;
```

## Color Usage in Components

The theme colors are automatically available in all components:

- `ocean-{50-900}` - Primary theme colors
- `deep-{50-900}` - Secondary theme colors
- `bg-gradient-ocean` - Primary gradient
- `bg-gradient-ocean-hover` - Hover gradient
- `bg-gradient-accent` - Accent gradient

## Animation Settings

You can also customize animation speeds in the theme file:

```javascript
animations: {
  duration: {
    fast: '150ms',    // Quick transitions
    normal: '200ms',  // Standard transitions
    slow: '300ms',    // Slow transitions
  },
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)', // Smooth easing
},
```

## Tips for Choosing Colors

1. **Use a color palette generator**: Try [coolors.co](https://coolors.co) or [tailwindcss.com/docs/customizing-colors](https://tailwindcss.com/docs/customizing-colors)
2. **Maintain contrast**: Ensure text is readable on backgrounds
3. **Test both modes**: Check your theme in both light and dark modes
4. **Keep it consistent**: Use the same color family for cohesion

## Need Help?

The theme system automatically handles:

- ✅ Light/Dark mode compatibility
- ✅ Smooth transitions
- ✅ Gradient animations
- ✅ Focus states
- ✅ Hover effects

Just change the colors and everything else works automatically!
