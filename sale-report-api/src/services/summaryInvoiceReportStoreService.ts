import { pool } from "../db/pool";
import { MatchSummary } from "../types/report.types";
import { SummaryInvoiceMergedRow } from "../types/summaryInvoiceExcel.types";
import { SummaryInvoiceProcessReportResult } from "../types/summaryInvoiceReport.types";

interface ReportRow {
  report_file_name: string;
  summary: MatchSummary;
  warnings: string[];
  rows: SummaryInvoiceMergedRow[];
}

/**
 * Shares the `reports` table with the fuel/lubricant modules — it's
 * schema-less JSONB storage keyed by a random UUID, so all row shapes
 * coexist safely.
 */
export const saveSummaryInvoiceReport = async (
  reportId: string,
  result: SummaryInvoiceProcessReportResult
): Promise<void> => {
  await pool.query(
    `INSERT INTO reports (id, report_file_name, summary, warnings, rows) VALUES ($1, $2, $3, $4, $5)`,
    [
      reportId,
      result.reportFileName,
      JSON.stringify(result.summary),
      JSON.stringify(result.warnings),
      JSON.stringify(result.rows),
    ]
  );
};

export const getSummaryInvoiceReport = async (reportId: string): Promise<SummaryInvoiceProcessReportResult | null> => {
  const { rows } = await pool.query<ReportRow>(
    `SELECT report_file_name, summary, warnings, rows FROM reports WHERE id = $1`,
    [reportId]
  );
  const row = rows[0];
  if (!row) return null;

  return {
    reportFileName: row.report_file_name,
    summary: row.summary,
    warnings: row.warnings,
    rows: row.rows,
  };
};
