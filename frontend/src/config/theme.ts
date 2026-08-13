// src/config/theme.ts — design tokens and theme configuration
// Extend this with your color palette, typography scale, spacing, etc.

export const theme = {
  colors: {
    primary: 'hsl(221, 83%, 53%)',
    secondary: 'hsl(262, 83%, 58%)',
    accent: 'hsl(316, 73%, 52%)',
    success: 'hsl(142, 71%, 45%)',
    warning: 'hsl(38, 92%, 50%)',
    error: 'hsl(0, 84%, 60%)',
  },
  radii: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },
} as const

export type Theme = typeof theme
