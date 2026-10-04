import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "kb_app",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/App",
        "./ArticleList": "./src/components/article-list",
        "./ArticleDetail": "./src/components/article-detail",
        "./SearchBox": "./src/components/search-box",
        "./CategoryFilter": "./src/components/category-filter"
      },
      shared: [
        "react",
        "react-dom",
        "react-router-dom",
        "@tanstack/react-query",
        "@mf-enterprise/ui-components",
        "@mf-enterprise/event-bus"
      ]
    })
  ],
  server: {
    port: 3004,
    cors: true,
    host: true
  },
  build: {
    target: "ES2022",
    outDir: "dist",
    emptyOutDir: false,
    sourcemap: true,
    rollupOptions: {
      input: "./src/App.tsx"
    }
  },
  resolve: {
    alias: {
      "@": "/src"
    }
  }
});
