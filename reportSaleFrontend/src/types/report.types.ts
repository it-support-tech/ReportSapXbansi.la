export interface MergedRow {
  invoiceNumber: string;
  matched: boolean;
  sap: Record<string, string | number | null> | null;
  banchi: Record<string, string | number | null> | null;
}

export interface MatchSummary {
  totalSap: number;
  totalBanchi: number;
  matched: number;
  unmatchedSap: number;
  unmatchedBanchi: number;
}

export interface ProcessReportResponse {
  reportId: string;
  summary: MatchSummary;
  warnings: string[];
  rows: MergedRow[];
  reportFileName: string;
}

/** Result of parsing the SAP B1 file alone, with no ບັນຊີ.la matching involved — used to verify SAP extraction in isolation. */
export interface SapDebugResponse {
  rows: Record<string, string | number | null>[];
  warnings: string[];
  totalRowsRead: number;
  skippedRows: number;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiFailure {
  success: false;
  message: string;
  details?: string[];
}

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

export type UploadStage = "idle" | "uploading" | "processing" | "done" | "error";
