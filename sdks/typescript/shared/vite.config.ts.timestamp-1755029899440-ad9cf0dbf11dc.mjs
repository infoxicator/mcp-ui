// vite.config.ts
import { defineConfig } from "file:///Users/ruben.casas@postman.com/Documents/mcp-ui-fork/node_modules/.pnpm/vite@5.4.19_@types+node@22.15.33_lightningcss@1.30.1/node_modules/vite/dist/node/index.js";
import dts from "file:///Users/ruben.casas@postman.com/Documents/mcp-ui-fork/node_modules/.pnpm/vite-plugin-dts@3.9.1_@types+node@22.15.33_rollup@4.44.0_typescript@5.8.3_vite@5.4.19_@_7469f9d7f34e02282a85590207e4da32/node_modules/vite-plugin-dts/dist/index.mjs";
import react from "file:///Users/ruben.casas@postman.com/Documents/mcp-ui-fork/node_modules/.pnpm/@vitejs+plugin-react-swc@3.10.2_@swc+helpers@0.5.17_vite@5.4.19_@types+node@22.15.33_lightningcss@1.30.1_/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "/Users/ruben.casas@postman.com/Documents/mcp-ui-fork/sdks/typescript/shared";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      tsconfigPath: path.resolve(__vite_injected_original_dirname, "tsconfig.json")
    })
  ],
  build: {
    lib: {
      entry: path.resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "McpUiShared",
      formats: ["es", "umd"],
      // UMD for broader compatibility if needed, es for modern
      fileName: (format) => `index.${format === "es" ? "mjs" : format === "umd" ? "js" : format + ".js"}`
    },
    sourcemap: true
    // Minify options if needed, default is esbuild which is fast
    // minify: 'terser',
    // terserOptions: { ... }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvcnViZW4uY2FzYXNAcG9zdG1hbi5jb20vRG9jdW1lbnRzL21jcC11aS1mb3JrL3Nka3MvdHlwZXNjcmlwdC9zaGFyZWRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9ydWJlbi5jYXNhc0Bwb3N0bWFuLmNvbS9Eb2N1bWVudHMvbWNwLXVpLWZvcmsvc2Rrcy90eXBlc2NyaXB0L3NoYXJlZC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvcnViZW4uY2FzYXNAcG9zdG1hbi5jb20vRG9jdW1lbnRzL21jcC11aS1mb3JrL3Nka3MvdHlwZXNjcmlwdC9zaGFyZWQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCBkdHMgZnJvbSAndml0ZS1wbHVnaW4tZHRzJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2MnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIGR0cyh7XG4gICAgICBpbnNlcnRUeXBlc0VudHJ5OiB0cnVlLFxuICAgICAgdHNjb25maWdQYXRoOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAndHNjb25maWcuanNvbicpLFxuICAgIH0pLFxuICBdLFxuICBidWlsZDoge1xuICAgIGxpYjoge1xuICAgICAgZW50cnk6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvaW5kZXgudHMnKSxcbiAgICAgIG5hbWU6ICdNY3BVaVNoYXJlZCcsXG4gICAgICBmb3JtYXRzOiBbJ2VzJywgJ3VtZCddLCAvLyBVTUQgZm9yIGJyb2FkZXIgY29tcGF0aWJpbGl0eSBpZiBuZWVkZWQsIGVzIGZvciBtb2Rlcm5cbiAgICAgIGZpbGVOYW1lOiAoZm9ybWF0KSA9PlxuICAgICAgICBgaW5kZXguJHtmb3JtYXQgPT09ICdlcycgPyAnbWpzJyA6IGZvcm1hdCA9PT0gJ3VtZCcgPyAnanMnIDogZm9ybWF0ICsgJy5qcyd9YCxcbiAgICB9LFxuICAgIHNvdXJjZW1hcDogdHJ1ZSxcbiAgICAvLyBNaW5pZnkgb3B0aW9ucyBpZiBuZWVkZWQsIGRlZmF1bHQgaXMgZXNidWlsZCB3aGljaCBpcyBmYXN0XG4gICAgLy8gbWluaWZ5OiAndGVyc2VyJyxcbiAgICAvLyB0ZXJzZXJPcHRpb25zOiB7IC4uLiB9XG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBbVosU0FBUyxvQkFBb0I7QUFDaGIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFIakIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sSUFBSTtBQUFBLE1BQ0Ysa0JBQWtCO0FBQUEsTUFDbEIsY0FBYyxLQUFLLFFBQVEsa0NBQVcsZUFBZTtBQUFBLElBQ3ZELENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxLQUFLO0FBQUEsTUFDSCxPQUFPLEtBQUssUUFBUSxrQ0FBVyxjQUFjO0FBQUEsTUFDN0MsTUFBTTtBQUFBLE1BQ04sU0FBUyxDQUFDLE1BQU0sS0FBSztBQUFBO0FBQUEsTUFDckIsVUFBVSxDQUFDLFdBQ1QsU0FBUyxXQUFXLE9BQU8sUUFBUSxXQUFXLFFBQVEsT0FBTyxTQUFTLEtBQUs7QUFBQSxJQUMvRTtBQUFBLElBQ0EsV0FBVztBQUFBO0FBQUE7QUFBQTtBQUFBLEVBSWI7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
