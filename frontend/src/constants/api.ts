export const API_ENDPOINTS = {
  PROCESS_REPORT: "/api/reports/process",
  DEBUG_PARSE_SAP: "/api/reports/debug/sap",
  DOWNLOAD_REPORT: (reportId: string) => `/api/reports/${reportId}/download`,
} as const;
