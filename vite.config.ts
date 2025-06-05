import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/mia-consent-offline-form/' // Matches your GitHub repo name
});