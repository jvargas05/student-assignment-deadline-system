import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Exposes the app to any local IP / Codespaces / Docker
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000', // Uses IPv4 explicitly to avoid Windows localhost IPv6 ECONNREFUSED bugs
        changeOrigin: true,
      },
    },
  },
});
