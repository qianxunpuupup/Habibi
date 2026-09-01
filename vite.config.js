import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  base: "/Habibi/",
  server: {
    port: 9090,
    open: true,
  },

  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  build: {
    target: "es2015",
    outDir: "docs",
    chunkSizeWarningLimit: 2000,

    dynamicImportVarsOptions: {
      warnOnError: true,
      exclude: [],
      include: ["src/views/**/*.vue"],
    },
  },
});
