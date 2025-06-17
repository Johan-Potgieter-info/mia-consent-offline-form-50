import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  base: '/mia-consent-offline-form-50/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['images/icon-192.png', 'images/icon-512.png'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        // Use your existing sw.js
        swSrc: 'public/mia-consent-offline-form-50/sw.js',
        swDest: 'dist/mia-consent-offline-form-50/sw.js',
      },
      // Disable default registration since you handle it in main.tsx
      injectRegister: null,
      // Use your existing manifest.json
      manifest: false,
    }),
  ],
});

