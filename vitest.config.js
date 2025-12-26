import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./vitest.setup.js",
    globals: true,
    include: ["tests/unit/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      all: true,
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "playwright.config.*",
        "vitest.config.*",
        "vitest.setup.*",
        "**/*.svg",
        "**/*.css",
      ],
    },
  },
});
