import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Served by thevitrine.fr under /outils/devis-maintenance/, behind the login in
// middleware.js. The build lands inside the site's own dist/ (run after astro build).
export default defineConfig({
  base: '/outils/devis-maintenance/',
  plugins: [react()],
  // issuers.ts reads the site's legal details from ../../src/data/legal.ts
  server: { fs: { allow: ['../..'] } },
  build: { outDir: '../../dist/outils/devis-maintenance', emptyOutDir: true },
});
