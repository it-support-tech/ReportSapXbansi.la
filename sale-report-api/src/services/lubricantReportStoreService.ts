import { pool } from "../db/pool";
import { MatchSummary } from "../types/report.types";
import { LubricantMergedRow } from "../types/lubricantExcel.types";
import { LubricantProcessReportResult } from "../types/lubricantReport.types";

interface ReportRow {
  report_file_name: string;
  summary: MatchSummary;
  warnings: string[];
  rows: LubricantMergedRow[];
}

/**
 * Shares the `reports` table with the fuel module — it's schema-less JSONB
 * storage keyed by a random UUID, so both row shapes coexist safely.
 */
export const saveLubricantReport = async (reportId: string, result: LubricantProcessReportResult): Promise<void> => {
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

export const getLubricantReport = async (reportId: string): Promise<LubricantProcessReportResult | null> => {
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
