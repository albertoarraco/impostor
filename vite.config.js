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
        manualChunks: (id) => {
          // More aggressive chunk splitting for better caching
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react';
            }
            if (id.includes('date-fns') || id.includes('prop-types')) {
              return 'vendor';
            }
            return 'vendor';
          }
          if (id.includes('/contexts/') || id.includes('/onboarding/')) {
            return 'contexts';
          }
          if (id.includes('/components/') && !id.includes('/onboarding/')) {
            return 'panels';
          }
          if (id.includes('/data/')) {
            return 'data';
          }
        },
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `assets/[name]-[hash].js`;
        }
      },
      // Improve tree shaking
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
    },
    // Aggressive performance optimizations
    cssCodeSplit: true,
    chunkSizeWarningLimit: 500,
    // Optimize for faster loading
    modulePreload: {
      polyfill: false,
    },
    // Reduce bundle size with aggressive minification
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2,
      },
      mangle: {
        properties: {
          regex: /^_/, // Mangle private properties
        },
      },
    },
  },
});
