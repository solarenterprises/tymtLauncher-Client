import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    react(),
    wasm(),
    topLevelAwait(),
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
    nodePolyfills({
      include: ["crypto", "vm", "process", "os", "stream"], // Include the required polyfills
    }),
  ],
  resolve: {
    alias: {
      buffer: "buffer/",
    },
  },
  server: {
    port: 1420,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
  build: {
    chunkSizeWarningLimit: 8192,
    rollupOptions: {
      plugins: [],
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
      plugins: [],
    },
  },
});
