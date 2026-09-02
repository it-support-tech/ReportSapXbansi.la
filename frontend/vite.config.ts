import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Overridden by docker-compose to "http://backend:4000" so the proxy reaches the backend container by service name.
const apiProxyTarget = process.env.VITE_API_PROXY_TARGET ?? "http://localhost:4000";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      "/api": {
        target: apiProxyTarget,
        changeOrigin: true,
      },
    },
  },
});
