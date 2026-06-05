/**
 * Arya Digital Production — Tailwind config
 * ------------------------------------------------------------------
 * The homepage (index.html) ships with the Tailwind Play CDN so it
 * previews instantly with no build step. For PRODUCTION, drop the CDN
 * <script> and compile Tailwind against this config + globals.css
 * (PostCSS or the Tailwind CLI) so you hit the JS / LCP budget and
 * remove any flash-of-unstyled-content.
 *
 * Color tokens point at CSS custom properties (defined in globals.css)
 * so the palette stays swappable at runtime without recompiling.
 *
 *   npx tailwindcss -i globals.css -o dist/site.css --minify
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './**/*.{html,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: 'var(--ink)',                 // #0B1437 primary dark, hero bg, headlines
        'ink-soft': 'var(--ink-soft)',     // #1A2347 hero overlay, depth
        surface: 'var(--surface)',         // #F7F4EE off-white section bg
        white: 'var(--white)',             // #FFFFFF cards on surface
        saffron: 'var(--saffron)',         // #F59E0B accent (CTAs, underlines)
        'saffron-deep': 'var(--saffron-deep)', // #B45309 hover state
        slate: 'var(--slate)',             // #475569 body text on light
        'slate-soft': 'var(--slate-soft)', // #64748B secondary text
        mist: 'var(--mist)',               // #E7E2D8 dividers, card borders
        forest: 'var(--forest)',           // #0F5132 trust / results badges only
      },
      fontFamily: {
        // Load via next/font/google in a Next.js app; <link> in the static file.
        serif: ['"Instrument Serif"', 'Georgia', 'serif'], // display: H1 / H2
        sans: ['Inter', 'system-ui', 'sans-serif'],        // body
        mono: ['"JetBrains Mono"', 'monospace'],           // Proof Band numerals
      },
      maxWidth: {
        container: '1280px',
      },
      borderRadius: {
        card: '12px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(11,20,55,0.08), 0 8px 24px rgba(11,20,55,0.04)',
        'card-hover': '0 2px 6px rgba(11,20,55,0.06), 0 16px 40px rgba(11,20,55,0.08)',
      },
      letterSpacing: {
        tightest: '-0.02em', // H1
        tighter: '-0.01em',  // H2
        eyebrow: '0.08em',   // eyebrow labels
      },
      transitionDuration: {
        250: '250ms',
        400: '400ms', // motion ceiling per brief
      },
    },
  },
  plugins: [],
};
