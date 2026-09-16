export interface ReportEndpoints {
  PROCESS_REPORT: string;
  DEBUG_PARSE_SAP: string;
  DOWNLOAD_REPORT: (reportId: string) => string;
}

// Paths are relative to apiClient's baseURL (which already ends in "/api") — don't repeat "/api" here.
const buildEndpoints = (basePath: string): ReportEndpoints => ({
  PROCESS_REPORT: `${basePath}/process`,
  DEBUG_PARSE_SAP: `${basePath}/debug/sap`,
  DOWNLOAD_REPORT: (reportId: string) => `${basePath}/${reportId}/download`,
});

export const API_ENDPOINTS = buildEndpoints("/reports");
export const LUBRICANT_API_ENDPOINTS = buildEndpoints("/lubricant");
export const SUMMARY_INVOICE_API_ENDPOINTS = buildEndpoints("/summary-invoice");
