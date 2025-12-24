import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Ajusta el base path para GitHub Pages (usuario.github.io/impostor/)
  base: '/impostor/',
  plugins: [react()],
});
