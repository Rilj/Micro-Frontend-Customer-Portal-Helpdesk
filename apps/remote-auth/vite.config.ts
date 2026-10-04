import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "auth_app",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/App",
        "./LoginPage": "./src/pages/login",
        "./RegisterPage": "./src/pages/register",
        "./ProfileSettings": "./src/pages/profile-settings"
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
    port: 3003,
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
