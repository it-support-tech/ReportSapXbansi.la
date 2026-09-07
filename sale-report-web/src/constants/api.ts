// Paths are relative to apiClient's baseURL (which already ends in "/api") — don't repeat "/api" here.
export const API_ENDPOINTS = {
  PROCESS_REPORT: "/reports/process",
  DEBUG_PARSE_SAP: "/reports/debug/sap",
  DOWNLOAD_REPORT: (reportId: string) => `/reports/${reportId}/download`,
} as const;
