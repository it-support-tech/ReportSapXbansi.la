import axios from "axios";

// Local dev: Vite proxies "/api" to the backend (see vite.config.ts), so a relative
// base URL works. Production (VPS): points straight at the live API domain.
export const apiClient = axios.create({
  baseURL: "https://support.ntp-lao.com/api",
  timeout: 120_000,
});
