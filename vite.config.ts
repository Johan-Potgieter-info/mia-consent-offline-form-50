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
      includeAssets: [
        'images/icon-192.png',
        'images/icon-512.png',
        'favicon.ico',
        'robots.txt'
      ],
      manifest: {
        name: 'MIA Consent Form',
        short_name: 'Consent',
        start_url: '/mia-consent-offline-form-50/',
        scope: '/mia-consent-offline-form-50/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#10b981',
        icons: [
          {
            src: 'images/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'images/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
      injectRegister: null // Because you're handling SW registration in main.tsx
    })
  ]
});