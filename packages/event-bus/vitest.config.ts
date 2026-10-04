import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    passWithNoTests: true,
    environment: "node",
    setupFiles: ["./src/setup.ts"],
    coverage: {
      reporter: ["text", "lcov"],
      exclude: ["node_modules/", "dist/"]
    }
  }
});
