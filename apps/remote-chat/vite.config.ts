import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "chat_app",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/App",
        "./ChatWindow": "./src/components/chat-window",
        "./NotificationBell": "./src/components/notification-bell"
      },
      shared: [
        "react",
        "react-dom",
        "react-router-dom",
        "zustand",
        "@tanstack/react-query",
        "socket.io-client",
        "@mf-enterprise/ui-components",
        "@mf-enterprise/event-bus"
      ]
    })
  ],
  server: {
    port: 3002,
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
