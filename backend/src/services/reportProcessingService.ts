import fs from "fs/promises";
import ExcelJS from "exceljs";
import { parseWorkbook } from "./excelParserService";
import { matchInvoices } from "./dataMatcherService";
import { generateReportWorkbook } from "./reportGeneratorService";
import { BANCHI_LA_COLUMN_MAP, SAP_B1_COLUMN_MAP } from "../constants/excelMap";
import { AppError } from "../utils/AppError";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { HTTP_STATUS } from "../constants/statusCodes";
import { BanchiLaRow, SapB1Row } from "../types/excel.types";
import { ProcessReportResult, UploadedFilesPayload } from "../types/report.types";

export const SAP_NUMERIC_FIELDS = ["quantityLiters", "govVatAllowance", "govStructuredPrice", "discount", "grandTotalInclVat"];
export const BANCHI_NUMERIC_FIELDS: string[] = [];

const safeUnlink = async (path: string): Promise<void> => {
  try {
    await fs.unlink(path);
  } catch {
    // best-effort cleanup of temp uploads; a leftover file isn't fatal
  }
};

/** Parses both uploaded files, matches them by invoice_number, and returns the merged rows. */
export const processReportData = async ({
  sapFilePath,
  banchiFilePath,
}: UploadedFilesPayload): Promise<ProcessReportResult> => {
  try {
    const [sapResult, banchiResult] = await Promise.all([
      parseWorkbook<SapB1Row>(sapFilePath, SAP_B1_COLUMN_MAP, SAP_NUMERIC_FIELDS),
      parseWorkbook<BanchiLaRow>(banchiFilePath, BANCHI_LA_COLUMN_MAP, BANCHI_NUMERIC_FIELDS),
    ]);

    const { rows, summary } = matchInvoices(sapResult.rows, banchiResult.rows);
    if (rows.length === 0) {
      throw new AppError(ERROR_MESSAGES.NO_MATCHING_ROWS, HTTP_STATUS.UNPROCESSABLE_ENTITY);
    }

    const reportFileName = `sale-report-${Date.now()}.xlsx`;

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

export const buildReportWorkbookBuffer = async (
  result: ProcessReportResult
): Promise<ExcelJS.Buffer> => {
  const workbook = await generateReportWorkbook(result.rows);
  return workbook.xlsx.writeBuffer();
};
