import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync } from 'fs';
import { resolve } from 'path';

export default defineConfig({
  // Ajusta el base path para GitHub Pages (usuario.github.io/impostor/)
  base: "/impostor/",
  plugins: [
    react(),
    {
      name: 'copy-manifest',
      closeBundle() {
        copyFileSync(
          resolve(__dirname, 'dist/.vite/manifest.json'),
          resolve(__dirname, 'dist/manifest.json')
        );
      },
    },
  ],
  build: {
    target: "es2020",
    manifest: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          words: ["/src/data/words.js"],
        },
      },
    },
  },
});
