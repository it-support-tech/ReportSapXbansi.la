import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "../constants/api";
import { ApiResult, ProcessReportResponse, SapDebugResponse } from "../types/report.types";

export const processReportFiles = async (
  sapFile: File,
  banchiFile: File,
  onUploadProgress?: (percent: number) => void
): Promise<ProcessReportResponse> => {
  const formData = new FormData();
  formData.append("sapFile", sapFile);
  formData.append("banchiFile", banchiFile);

  const { data } = await apiClient.post<ApiResult<ProcessReportResponse>>(
    API_ENDPOINTS.PROCESS_REPORT,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (evt) => {
        if (!onUploadProgress || !evt.total) return;
        onUploadProgress(Math.round((evt.loaded / evt.total) * 100));
      },
    }
  );

  if (!data.success) throw new Error(data.message);
  return data.data;
};

/** Parses just the SAP B1 file — no ບັນຊີ.la, no matching — to verify SAP extraction in isolation. */
export const debugParseSapFile = async (sapFile: File): Promise<SapDebugResponse> => {
  const formData = new FormData();
  formData.append("sapFile", sapFile);

  const { data } = await apiClient.post<ApiResult<SapDebugResponse>>(API_ENDPOINTS.DEBUG_PARSE_SAP, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const downloadReportFile = async (reportId: string, fileName: string): Promise<void> => {
  const response = await apiClient.get(API_ENDPOINTS.DOWNLOAD_REPORT(reportId), {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
