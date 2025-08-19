// vite.config.ts
import { defineConfig } from "file:///Users/ruben.casas@postman.com/Documents/mcp-ui-fork/node_modules/.pnpm/vite@5.4.19_@types+node@18.19.112_lightningcss@1.30.1/node_modules/vite/dist/node/index.js";
import dts from "file:///Users/ruben.casas@postman.com/Documents/mcp-ui-fork/node_modules/.pnpm/vite-plugin-dts@3.9.1_@types+node@18.19.112_rollup@4.44.0_typescript@5.8.3_vite@5.4.19__dbff6e51877bea586338416dedabd55b/node_modules/vite-plugin-dts/dist/index.mjs";
import path from "path";
import react from "file:///Users/ruben.casas@postman.com/Documents/mcp-ui-fork/node_modules/.pnpm/@vitejs+plugin-react-swc@3.10.2_@swc+helpers@0.5.17_vite@5.4.19_@types+node@22.15.33_lightningcss@1.30.1_/node_modules/@vitejs/plugin-react-swc/index.mjs";
var __vite_injected_original_dirname = "/Users/ruben.casas@postman.com/Documents/mcp-ui-fork/sdks/typescript/server";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      tsconfigPath: path.resolve(__vite_injected_original_dirname, "tsconfig.json"),
      exclude: ["**/__tests__/**", "**/*.test.ts", "**/*.spec.ts"]
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ],
  build: {
    lib: {
      entry: path.resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "McpUiServer",
      formats: ["es", "cjs"],
      // cjs for Node compatibility
      fileName: (format) => `index.${format === "es" ? "mjs" : "cjs"}`
    },
    target: "node18",
    sourcemap: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvcnViZW4uY2FzYXNAcG9zdG1hbi5jb20vRG9jdW1lbnRzL21jcC11aS1mb3JrL3Nka3MvdHlwZXNjcmlwdC9zZXJ2ZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9ydWJlbi5jYXNhc0Bwb3N0bWFuLmNvbS9Eb2N1bWVudHMvbWNwLXVpLWZvcmsvc2Rrcy90eXBlc2NyaXB0L3NlcnZlci92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvcnViZW4uY2FzYXNAcG9zdG1hbi5jb20vRG9jdW1lbnRzL21jcC11aS1mb3JrL3Nka3MvdHlwZXNjcmlwdC9zZXJ2ZXIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCBkdHMgZnJvbSAndml0ZS1wbHVnaW4tZHRzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0LXN3Yyc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIGR0cyh7XG4gICAgICBpbnNlcnRUeXBlc0VudHJ5OiB0cnVlLFxuICAgICAgdHNjb25maWdQYXRoOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAndHNjb25maWcuanNvbicpLFxuICAgICAgZXhjbHVkZTogWycqKi9fX3Rlc3RzX18vKionLCAnKiovKi50ZXN0LnRzJywgJyoqLyouc3BlYy50cyddLFxuICAgIH0pLFxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gIF0sXG4gIGJ1aWxkOiB7XG4gICAgbGliOiB7XG4gICAgICBlbnRyeTogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9pbmRleC50cycpLFxuICAgICAgbmFtZTogJ01jcFVpU2VydmVyJyxcbiAgICAgIGZvcm1hdHM6IFsnZXMnLCAnY2pzJ10sIC8vIGNqcyBmb3IgTm9kZSBjb21wYXRpYmlsaXR5XG4gICAgICBmaWxlTmFtZTogKGZvcm1hdCkgPT4gYGluZGV4LiR7Zm9ybWF0ID09PSAnZXMnID8gJ21qcycgOiAnY2pzJ31gLFxuICAgIH0sXG4gICAgdGFyZ2V0OiAnbm9kZTE4JyxcbiAgICBzb3VyY2VtYXA6IHRydWUsXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBbVosU0FBUyxvQkFBb0I7QUFDaGIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sVUFBVTtBQUNqQixPQUFPLFdBQVc7QUFIbEIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sSUFBSTtBQUFBLE1BQ0Ysa0JBQWtCO0FBQUEsTUFDbEIsY0FBYyxLQUFLLFFBQVEsa0NBQVcsZUFBZTtBQUFBLE1BQ3JELFNBQVMsQ0FBQyxtQkFBbUIsZ0JBQWdCLGNBQWM7QUFBQSxJQUM3RCxDQUFDO0FBQUE7QUFBQSxFQUVIO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxLQUFLO0FBQUEsTUFDSCxPQUFPLEtBQUssUUFBUSxrQ0FBVyxjQUFjO0FBQUEsTUFDN0MsTUFBTTtBQUFBLE1BQ04sU0FBUyxDQUFDLE1BQU0sS0FBSztBQUFBO0FBQUEsTUFDckIsVUFBVSxDQUFDLFdBQVcsU0FBUyxXQUFXLE9BQU8sUUFBUSxLQUFLO0FBQUEsSUFDaEU7QUFBQSxJQUNBLFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxFQUNiO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
