import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Forward Figma sync calls to the Express server (server.js)
      '/api': 'http://localhost:3001',
    },
  },
});
