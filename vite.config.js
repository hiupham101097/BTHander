import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: { manifest: true },
  server: {
    port: 4300,
    proxy: { "/api": "http://127.0.0.1:8787", "/media": "http://127.0.0.1:8787" },
  },
});
