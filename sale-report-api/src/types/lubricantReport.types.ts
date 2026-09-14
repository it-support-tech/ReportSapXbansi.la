import { MatchSummary } from "./report.types";
import { LubricantMergedRow } from "./lubricantExcel.types";

export interface LubricantProcessReportResult {
  summary: MatchSummary;
  rows: LubricantMergedRow[];
  warnings: string[];
  reportFileName: string;
}

export interface UploadedFilesPayload {
  sapFilePath: string;
  banchiFilePath: string;
}
