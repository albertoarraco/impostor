import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync, existsSync } from 'fs';
import { resolve } from 'path';

export default defineConfig({
  // Ajusta el base path para GitHub Pages (usuario.github.io/impostor/)
  base: "/impostor/",
  plugins: [
    react(),
    {
      name: 'copy-manifest',
      closeBundle() {
        const sourcePath = resolve(__dirname, 'dist/.vite/manifest.json');
        const targetPath = resolve(__dirname, 'dist/manifest.json');
        
        if (existsSync(sourcePath)) {
          copyFileSync(sourcePath, targetPath);
        }
      },
    },
  ],
  build: {
    target: "es2020",
    manifest: true,
    sourcemap: false,
    minify: "terser",
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          vendor: ["prop-types", "date-fns"],
          contexts: [
            "/src/contexts/GameStateContext.jsx",
            "/src/components/onboarding/OnboardingContext.jsx"
          ],
          panels: [
            "/src/components/ConfigPanel.jsx",
            "/src/components/LobbyPanel.jsx",
            "/src/components/HistoryList.jsx",
            "/src/components/WordsPanel.jsx",
            "/src/components/TransferPanel.jsx"
          ],
          onboarding: [
            "/src/components/onboarding/OnboardingOverlay.jsx"
          ],
          words: ["/src/data/words.js"]
        },
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `assets/[name]-[hash].js`;
        }
      },
    },
  },
});
