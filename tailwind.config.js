/**
 * Per the brief: colors live in CSS variables (see src/globals.css), not in the
 * Tailwind theme, so the dev can swap the palette without touching this file.
 * Tailwind here only handles layout, spacing, and responsive utilities.
 * @type {import('tailwindcss').Config}
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      screens: {
        wide: '1440px',
      },
    },
  },
  plugins: [],
};
