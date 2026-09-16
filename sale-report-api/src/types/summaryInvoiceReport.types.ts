import { MatchSummary } from "./report.types";
import { SummaryInvoiceMergedRow } from "./summaryInvoiceExcel.types";

export interface SummaryInvoiceProcessReportResult {
  summary: MatchSummary;
  rows: SummaryInvoiceMergedRow[];
  warnings: string[];
  reportFileName: string;
}

export interface UploadedFilesPayload {
  sapFilePath: string;
  banchiFilePath: string;
}
