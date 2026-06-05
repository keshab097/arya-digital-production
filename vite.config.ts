import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves at /<repo>/, so the build needs that base. Gated on an
  // env var so the default build (root domains like Vercel/Netlify) stays at '/'.
  base: process.env.GH_PAGES ? '/arya-digital-production/' : '/',
  server: {
    port: 5173,
    host: true,
  },
});
