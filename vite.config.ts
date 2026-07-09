import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "mrkt-simulator";
const base = process.env.GITHUB_PAGES ? `/${repo}/` : "/";

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    proxy: {
      "/gift-api": {
        target: "https://api.changes.tg",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/gift-api/, "")
      }
    }
  }
});
