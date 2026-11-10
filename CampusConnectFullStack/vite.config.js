import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In development, API calls (/api/...) are forwarded to the Node server on port 5000.
// In production the same Node server serves the built files and the API together.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:5000' } },
});
