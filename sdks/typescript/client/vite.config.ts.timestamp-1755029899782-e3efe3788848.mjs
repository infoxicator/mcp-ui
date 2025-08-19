// vite.config.ts
import { defineConfig } from "file:///Users/ruben.casas@postman.com/Documents/mcp-ui-fork/node_modules/.pnpm/vite@5.4.19_@types+node@22.15.33_lightningcss@1.30.1/node_modules/vite/dist/node/index.js";
import dts from "file:///Users/ruben.casas@postman.com/Documents/mcp-ui-fork/node_modules/.pnpm/vite-plugin-dts@3.9.1_@types+node@22.15.33_rollup@4.44.0_typescript@5.8.3_vite@5.4.19_@_7469f9d7f34e02282a85590207e4da32/node_modules/vite-plugin-dts/dist/index.mjs";
import path from "path";
import react from "file:///Users/ruben.casas@postman.com/Documents/mcp-ui-fork/node_modules/.pnpm/@vitejs+plugin-react-swc@3.10.2_@swc+helpers@0.5.17_vite@5.4.19_@types+node@22.15.33_lightningcss@1.30.1_/node_modules/@vitejs/plugin-react-swc/index.mjs";
var __vite_injected_original_dirname = "/Users/ruben.casas@postman.com/Documents/mcp-ui-fork/sdks/typescript/client";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      exclude: ["**/__tests__/**", "**/*.test.ts", "**/*.spec.ts", "**/UIResourceRendererWC.tsx"]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })
  ],
  build: {
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "McpUiClient",
      formats: ["es", "umd"],
      fileName: (format) => `index.${format === "es" ? "mjs" : format === "umd" ? "js" : format + ".js"}`
    },
    rollupOptions: {
      external: [
        "react",
        "react/jsx-runtime",
        "@mcp-ui/shared",
        /@modelcontextprotocol\/sdk(\/.*)?/
      ],
      output: {
        globals: {
          react: "React",
          "react/jsx-runtime": "jsxRuntime",
          "@mcp-ui/shared": "McpUiShared",
          "@modelcontextprotocol/sdk": "ModelContextProtocolSDK"
        }
      }
    },
    sourcemap: false
  }
  // Vitest specific config can go here if not using a separate vitest.config.ts for the package
  // test: { ... }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvcnViZW4uY2FzYXNAcG9zdG1hbi5jb20vRG9jdW1lbnRzL21jcC11aS1mb3JrL3Nka3MvdHlwZXNjcmlwdC9jbGllbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9ydWJlbi5jYXNhc0Bwb3N0bWFuLmNvbS9Eb2N1bWVudHMvbWNwLXVpLWZvcmsvc2Rrcy90eXBlc2NyaXB0L2NsaWVudC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvcnViZW4uY2FzYXNAcG9zdG1hbi5jb20vRG9jdW1lbnRzL21jcC11aS1mb3JrL3Nka3MvdHlwZXNjcmlwdC9jbGllbnQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCBkdHMgZnJvbSAndml0ZS1wbHVnaW4tZHRzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0LXN3Yyc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIGR0cyh7XG4gICAgICBpbnNlcnRUeXBlc0VudHJ5OiB0cnVlLFxuICAgICAgZXhjbHVkZTogWycqKi9fX3Rlc3RzX18vKionLCAnKiovKi50ZXN0LnRzJywgJyoqLyouc3BlYy50cycsICcqKi9VSVJlc291cmNlUmVuZGVyZXJXQy50c3gnXSxcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgfSkgYXMgYW55LFxuICBdLFxuICBidWlsZDoge1xuICAgIGVtcHR5T3V0RGlyOiBmYWxzZSxcbiAgICBsaWI6IHtcbiAgICAgIGVudHJ5OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2luZGV4LnRzJyksXG4gICAgICBuYW1lOiAnTWNwVWlDbGllbnQnLFxuICAgICAgZm9ybWF0czogWydlcycsICd1bWQnXSxcbiAgICAgIGZpbGVOYW1lOiAoZm9ybWF0KSA9PlxuICAgICAgICBgaW5kZXguJHtmb3JtYXQgPT09ICdlcycgPyAnbWpzJyA6IGZvcm1hdCA9PT0gJ3VtZCcgPyAnanMnIDogZm9ybWF0ICsgJy5qcyd9YCxcbiAgICB9LFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGV4dGVybmFsOiBbXG4gICAgICAgICdyZWFjdCcsXG4gICAgICAgICdyZWFjdC9qc3gtcnVudGltZScsXG4gICAgICAgICdAbWNwLXVpL3NoYXJlZCcsXG4gICAgICAgIC9AbW9kZWxjb250ZXh0cHJvdG9jb2xcXC9zZGsoXFwvLiopPy8sXG4gICAgICBdLFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIGdsb2JhbHM6IHtcbiAgICAgICAgICByZWFjdDogJ1JlYWN0JyxcbiAgICAgICAgICAncmVhY3QvanN4LXJ1bnRpbWUnOiAnanN4UnVudGltZScsXG4gICAgICAgICAgJ0BtY3AtdWkvc2hhcmVkJzogJ01jcFVpU2hhcmVkJyxcbiAgICAgICAgICAnQG1vZGVsY29udGV4dHByb3RvY29sL3Nkayc6ICdNb2RlbENvbnRleHRQcm90b2NvbFNESycsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgc291cmNlbWFwOiBmYWxzZSxcbiAgfSxcbiAgLy8gVml0ZXN0IHNwZWNpZmljIGNvbmZpZyBjYW4gZ28gaGVyZSBpZiBub3QgdXNpbmcgYSBzZXBhcmF0ZSB2aXRlc3QuY29uZmlnLnRzIGZvciB0aGUgcGFja2FnZVxuICAvLyB0ZXN0OiB7IC4uLiB9XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBbVosU0FBUyxvQkFBb0I7QUFDaGIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sVUFBVTtBQUNqQixPQUFPLFdBQVc7QUFIbEIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sSUFBSTtBQUFBLE1BQ0Ysa0JBQWtCO0FBQUEsTUFDbEIsU0FBUyxDQUFDLG1CQUFtQixnQkFBZ0IsZ0JBQWdCLDZCQUE2QjtBQUFBO0FBQUEsSUFFNUYsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLGFBQWE7QUFBQSxJQUNiLEtBQUs7QUFBQSxNQUNILE9BQU8sS0FBSyxRQUFRLGtDQUFXLGNBQWM7QUFBQSxNQUM3QyxNQUFNO0FBQUEsTUFDTixTQUFTLENBQUMsTUFBTSxLQUFLO0FBQUEsTUFDckIsVUFBVSxDQUFDLFdBQ1QsU0FBUyxXQUFXLE9BQU8sUUFBUSxXQUFXLFFBQVEsT0FBTyxTQUFTLEtBQUs7QUFBQSxJQUMvRTtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsVUFBVTtBQUFBLFFBQ1I7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDTixTQUFTO0FBQUEsVUFDUCxPQUFPO0FBQUEsVUFDUCxxQkFBcUI7QUFBQSxVQUNyQixrQkFBa0I7QUFBQSxVQUNsQiw2QkFBNkI7QUFBQSxRQUMvQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxXQUFXO0FBQUEsRUFDYjtBQUFBO0FBQUE7QUFHRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
