import { pool } from "../db/pool";
import { MatchSummary, ProcessReportResult } from "../types/report.types";
import { MergedRow } from "../types/excel.types";

interface ReportRow {
  report_file_name: string;
  summary: MatchSummary;
  warnings: string[];
  rows: MergedRow[];
}

/** Persists a processed report so the download step doesn't need the original uploads re-sent. */
export const saveReport = async (reportId: string, result: ProcessReportResult): Promise<void> => {
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

export const getReport = async (reportId: string): Promise<ProcessReportResult | null> => {
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
