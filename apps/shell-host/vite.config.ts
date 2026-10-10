import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

const REMOTE_TICKETING = "http://localhost:3001/assets/remoteEntry.js";
const REMOTE_CHAT = "http://localhost:3002/assets/remoteEntry.js";
const REMOTE_AUTH = "http://localhost:3003/assets/remoteEntry.js";
const REMOTE_KB = "http://localhost:3004/assets/remoteEntry.js";

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";
  const remoteTicketing = process.env.VITE_REMOTE_TICKETING || REMOTE_TICKETING;
  const remoteChat = process.env.VITE_REMOTE_CHAT || REMOTE_CHAT;
  const remoteAuth = process.env.VITE_REMOTE_AUTH || REMOTE_AUTH;
  const remoteKb = process.env.VITE_REMOTE_KB || REMOTE_KB;

  return {
    plugins: [
      react(),
      federation({
        name: "shell_host",
        remotes: {
          authApp: remoteAuth,
          ticketingApp: remoteTicketing,
          chatApp: remoteChat,
          kbApp: remoteKb
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
      port: 3000,
      cors: true,
      host: true
    },
    build: {
      target: "ES2022",
      outDir: "dist",
      emptyOutDir: false,
      sourcemap: !isProd,
      commonjsOptions: {
        include: [/node_modules/]
      }
    },
    optimizeDeps: {
      exclude: ["@mf-enterprise/event-bus"]
    },
    resolve: {
      alias: {
        "@": "/src"
      }
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./src/setupTests.ts"],
      include: ["src/**/*.test.{ts,tsx}"],
      coverage: {
        reporter: ["text", "lcov"],
        exclude: ["node_modules/", "dist/", "src/setupTests.ts"]
      }
    }
  };
});
