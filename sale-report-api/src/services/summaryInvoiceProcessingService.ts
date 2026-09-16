import fs from "fs/promises";
import ExcelJS from "exceljs";
import { parseWorkbook } from "./excelParserService";
import { matchInvoices } from "./dataMatcherService";
import { generateSummaryInvoiceReportWorkbook } from "./reportGeneratorSummaryInvoiceService";
import { BANCHI_LA_COLUMN_MAP } from "../constants/excelMap";
import { SAP_SUMMARY_INVOICE_COLUMN_MAP } from "../constants/summaryInvoiceExcelMap";
import { AppError } from "../utils/AppError";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { HTTP_STATUS } from "../constants/statusCodes";
import { BanchiLaRow } from "../types/excel.types";
import { SapSummaryInvoiceRow } from "../types/summaryInvoiceExcel.types";
import { SummaryInvoiceProcessReportResult, UploadedFilesPayload } from "../types/summaryInvoiceReport.types";

export const SUMMARY_INVOICE_SAP_NUMERIC_FIELDS = ["qty", "unitPrice", "grossTotalInclVat"];
export const SUMMARY_INVOICE_BANCHI_NUMERIC_FIELDS: string[] = [];

const safeUnlink = async (path: string): Promise<void> => {
  try {
    await fs.unlink(path);
  } catch {
    // best-effort cleanup of temp uploads; a leftover file isn't fatal
  }
};

/** Parses both uploaded files, matches them by invoice_number, and returns the merged rows. */
export const processSummaryInvoiceReportData = async ({
  sapFilePath,
  banchiFilePath,
}: UploadedFilesPayload): Promise<SummaryInvoiceProcessReportResult> => {
  try {
    const [sapResult, banchiResult] = await Promise.all([
      parseWorkbook<SapSummaryInvoiceRow>(sapFilePath, SAP_SUMMARY_INVOICE_COLUMN_MAP, SUMMARY_INVOICE_SAP_NUMERIC_FIELDS),
      parseWorkbook<BanchiLaRow>(banchiFilePath, BANCHI_LA_COLUMN_MAP, SUMMARY_INVOICE_BANCHI_NUMERIC_FIELDS),
    ]);

    const { rows, summary } = matchInvoices(sapResult.rows, banchiResult.rows);
    if (rows.length === 0) {
      throw new AppError(ERROR_MESSAGES.NO_MATCHING_ROWS, HTTP_STATUS.UNPROCESSABLE_ENTITY);
    }

    const reportFileName = `summary-invoice-report-${Date.now()}.xlsx`;

    return {
      summary,
      rows,
      warnings: [...sapResult.warnings, ...banchiResult.warnings],
      reportFileName,
    };
  } finally {
    await Promise.all([safeUnlink(sapFilePath), safeUnlink(banchiFilePath)]);
  }
};

export const buildSummaryInvoiceReportWorkbookBuffer = async (
  result: SummaryInvoiceProcessReportResult
): Promise<ExcelJS.Buffer> => {
  const workbook = await generateSummaryInvoiceReportWorkbook(result.rows);
  return workbook.xlsx.writeBuffer();
};
