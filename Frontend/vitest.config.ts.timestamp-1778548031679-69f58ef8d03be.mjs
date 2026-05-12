// vitest.config.ts
import { defineConfig } from "file:///C:/Users/Memo/Downloads/www.starbucks.eg/www.starbucks.eg/starbucks-eg-react/Frontend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Memo/Downloads/www.starbucks.eg/www.starbucks.eg/starbucks-eg-react/Frontend/node_modules/@vitejs/plugin-react/dist/index.js";
import path from "path";
import { fileURLToPath } from "url";
var __vite_injected_original_import_meta_url = "file:///C:/Users/Memo/Downloads/www.starbucks.eg/www.starbucks.eg/starbucks-eg-react/Frontend/vitest.config.ts";
var __filename = fileURLToPath(__vite_injected_original_import_meta_url);
var __dirname = path.dirname(__filename);
var vitest_config_default = defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/dist/**",
        "**/.next/**"
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      }
    },
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: ["node_modules", "dist", ".idea", ".git", ".cache"],
    testTimeout: 1e4,
    hookTimeout: 1e4
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/i18n": path.resolve(__dirname, "./src/test/__mocks__/i18n.ts")
    }
  }
});
export {
  vitest_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZXN0LmNvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXE1lbW9cXFxcRG93bmxvYWRzXFxcXHd3dy5zdGFyYnVja3MuZWdcXFxcd3d3LnN0YXJidWNrcy5lZ1xcXFxzdGFyYnVja3MtZWctcmVhY3RcXFxcRnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXE1lbW9cXFxcRG93bmxvYWRzXFxcXHd3dy5zdGFyYnVja3MuZWdcXFxcd3d3LnN0YXJidWNrcy5lZ1xcXFxzdGFyYnVja3MtZWctcmVhY3RcXFxcRnJvbnRlbmRcXFxcdml0ZXN0LmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvTWVtby9Eb3dubG9hZHMvd3d3LnN0YXJidWNrcy5lZy93d3cuc3RhcmJ1Y2tzLmVnL3N0YXJidWNrcy1lZy1yZWFjdC9Gcm9udGVuZC92aXRlc3QuY29uZmlnLnRzXCI7Ly8vIDxyZWZlcmVuY2UgdHlwZXM9XCJ2aXRlc3RcIiAvPlxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAndXJsJztcblxuY29uc3QgX19maWxlbmFtZSA9IGZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsKTtcbmNvbnN0IF9fZGlybmFtZSA9IHBhdGguZGlybmFtZShfX2ZpbGVuYW1lKTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCkgYXMgYW55XSxcbiAgdGVzdDoge1xuICAgIGdsb2JhbHM6IHRydWUsXG4gICAgZW52aXJvbm1lbnQ6ICdqc2RvbScsXG4gICAgc2V0dXBGaWxlczogWycuL3NyYy90ZXN0L3NldHVwLnRzJ10sXG4gICAgY292ZXJhZ2U6IHtcbiAgICAgIHByb3ZpZGVyOiAndjgnLFxuICAgICAgcmVwb3J0ZXI6IFsndGV4dCcsICdqc29uJywgJ2h0bWwnLCAnbGNvdiddLFxuICAgICAgZXhjbHVkZTogW1xuICAgICAgICAnbm9kZV9tb2R1bGVzLycsXG4gICAgICAgICdzcmMvdGVzdC8nLFxuICAgICAgICAnKiovKi5kLnRzJyxcbiAgICAgICAgJyoqLyouY29uZmlnLionLFxuICAgICAgICAnKiovZGlzdC8qKicsXG4gICAgICAgICcqKi8ubmV4dC8qKicsXG4gICAgICBdLFxuICAgICAgdGhyZXNob2xkczoge1xuICAgICAgICBsaW5lczogODAsXG4gICAgICAgIGZ1bmN0aW9uczogODAsXG4gICAgICAgIGJyYW5jaGVzOiA4MCxcbiAgICAgICAgc3RhdGVtZW50czogODAsXG4gICAgICB9LFxuICAgIH0sXG4gICAgaW5jbHVkZTogWydzcmMvKiovKi57dGVzdCxzcGVjfS57anMsbWpzLGNqcyx0cyxtdHMsY3RzLGpzeCx0c3h9J10sXG4gICAgZXhjbHVkZTogWydub2RlX21vZHVsZXMnLCAnZGlzdCcsICcuaWRlYScsICcuZ2l0JywgJy5jYWNoZSddLFxuICAgIHRlc3RUaW1lb3V0OiAxMDAwMCxcbiAgICBob29rVGltZW91dDogMTAwMDAsXG4gIH0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcbiAgICAgICdAL2kxOG4nOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvdGVzdC9fX21vY2tzX18vaTE4bi50cycpLFxuICAgIH0sXG4gIH0sXG59IGFzIGFueSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixTQUFTLHFCQUFxQjtBQUpxUSxJQUFNLDJDQUEyQztBQU1wVixJQUFNLGFBQWEsY0FBYyx3Q0FBZTtBQUNoRCxJQUFNLFlBQVksS0FBSyxRQUFRLFVBQVU7QUFFekMsSUFBTyx3QkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sQ0FBUTtBQUFBLEVBQ3hCLE1BQU07QUFBQSxJQUNKLFNBQVM7QUFBQSxJQUNULGFBQWE7QUFBQSxJQUNiLFlBQVksQ0FBQyxxQkFBcUI7QUFBQSxJQUNsQyxVQUFVO0FBQUEsTUFDUixVQUFVO0FBQUEsTUFDVixVQUFVLENBQUMsUUFBUSxRQUFRLFFBQVEsTUFBTTtBQUFBLE1BQ3pDLFNBQVM7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsTUFDQSxZQUFZO0FBQUEsUUFDVixPQUFPO0FBQUEsUUFDUCxXQUFXO0FBQUEsUUFDWCxVQUFVO0FBQUEsUUFDVixZQUFZO0FBQUEsTUFDZDtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVMsQ0FBQyxzREFBc0Q7QUFBQSxJQUNoRSxTQUFTLENBQUMsZ0JBQWdCLFFBQVEsU0FBUyxRQUFRLFFBQVE7QUFBQSxJQUMzRCxhQUFhO0FBQUEsSUFDYixhQUFhO0FBQUEsRUFDZjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsV0FBVyxPQUFPO0FBQUEsTUFDcEMsVUFBVSxLQUFLLFFBQVEsV0FBVyw4QkFBOEI7QUFBQSxJQUNsRTtBQUFBLEVBQ0Y7QUFDRixDQUFROyIsCiAgIm5hbWVzIjogW10KfQo=
