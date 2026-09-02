import { MergedRow } from "./excel.types";

export interface MatchSummary {
  totalSap: number;
  totalBanchi: number;
  matched: number;
  unmatchedSap: number;
  unmatchedBanchi: number;
}

export interface ProcessReportResult {
  summary: MatchSummary;
  rows: MergedRow[];
  warnings: string[];
  reportFileName: string;
}

export interface UploadedFilesPayload {
  sapFilePath: string;
  banchiFilePath: string;
}
