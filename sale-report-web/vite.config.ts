import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Overridden by docker-compose to "http://backend:4000" so the proxy reaches the backend container by service name.
const apiProxyTarget = process.env.VITE_API_PROXY_TARGET ?? "http://localhost:4000";

export default defineConfig(({ command }) => ({
  // Production is served under https://support.ntp-lao.com/sale-report-web/
  // (a sub-path, not domain root) — local dev stays at "/" so localhost:5173
  // keeps working unchanged. This also sets import.meta.env.BASE_URL, which
  // App.tsx passes to <BrowserRouter basename> so client-side routes match.
  base: command === "build" ? "/sale-report-web/" : "/",
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
}));
