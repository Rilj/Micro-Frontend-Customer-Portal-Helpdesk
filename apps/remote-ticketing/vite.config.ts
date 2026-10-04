import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "ticketing_app",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/App",
        "./TicketList": "./src/components/ticket-list",
        "./TicketForm": "./src/components/ticket-form",
        "./TicketDetail": "./src/components/ticket-detail",
        "./DashboardStats": "./src/components/dashboard-stats",
        "./RecentTickets": "./src/components/recent-tickets"
      },
      shared: [
        "react",
        "react-dom",
        "react-router-dom",
        "zustand",
        "@tanstack/react-query",
        "@mf-enterprise/ui-components",
        "@mf-enterprise/event-bus"
      ]
    })
  ],
  server: {
    port: 3001,
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
