import axios from "axios";

// Local dev (current value): Vite proxies "/api" to the backend (see
// vite.config.ts), so a relative base URL reaches whatever's running locally.
// Deploying to the VPS: change this to "https://support.ntp-lao.com/api"
// before building, so the browser calls the live API directly.
export const apiClient = axios.create({
  // baseURL: "/api",
  baseURL: "https://support.ntp-lao.com/api",
  timeout: 120_000,
});
