import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import nodePolyfills from "rollup-plugin-polyfill-node";

import nodeResolve from "@rollup/plugin-node-resolve";
import rollupNodePolyFill from "rollup-plugin-node-polyfills";
import commonjs from "@rollup/plugin-commonjs";

import inject from "@rollup/plugin-inject";

export default defineConfig({
  plugins: [
    react(),
    wasm(),
    topLevelAwait(),
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
    nodePolyfills(),
    NodeGlobalsPolyfillPlugin({
      buffer: true,
    }),
    NodeModulesPolyfillPlugin(),
    inject({
      Buffer: ["buffer", "Buffer"],
    }),
    commonjs({}),
  ],
  resolve: {
    alias: {
      buffer: "buffer/",
    },
  },
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
  build: {
    minify: false,
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "prop-types",
        "react-is",
        "@mui/system/colorManipulator",
        "@mui/system/createStyled",
        "use-sync-external-store/with-selector.js",
        "borsh",
        "bigint-buffer",
        "rpc-websockets/dist/lib/client",
        "bip39",
        "ethereumjs-wallet",
        "ed25519-hd-key",
      ],
      plugins: [
        nodeResolve({
          browser: true,
          preferBuiltins: false,
          mainFields: ["browser", "module", "main"],
        }),
        rollupNodePolyFill(),
        commonjs({
          include: /node_modules/,
        }),
      ],
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
});
