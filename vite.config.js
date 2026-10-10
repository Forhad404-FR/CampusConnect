import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' makes the built files work from any sub-path, e.g.
// https://<user>.github.io/CampusConnect/ (GitHub Pages) or a local preview.
export default defineConfig({
  base: './',
  plugins: [react()],
});
