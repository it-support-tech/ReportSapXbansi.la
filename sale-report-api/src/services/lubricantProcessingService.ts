import fs from "fs/promises";
import ExcelJS from "exceljs";
import { parseWorkbook } from "./excelParserService";
import { matchInvoices } from "./dataMatcherService";
import { generateLubricantReportWorkbook } from "./reportGeneratorLubricantService";
import { BANCHI_LA_COLUMN_MAP } from "../constants/excelMap";
import { SAP_LUBRICANT_COLUMN_MAP } from "../constants/lubricantExcelMap";
import { AppError } from "../utils/AppError";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { HTTP_STATUS } from "../constants/statusCodes";
import { BanchiLaRow } from "../types/excel.types";
import { SapLubricantRow } from "../types/lubricantExcel.types";
import { LubricantProcessReportResult, UploadedFilesPayload } from "../types/lubricantReport.types";

export const LUBRICANT_SAP_NUMERIC_FIELDS = [
  "unitPrice",
  "qty",
  "literPerUnit",
  "totalLiters",
  "amountExclVat",
  "vatAmount",
  "grandTotalInclVat",
  "amountThb",
  "amountUsd",
];
export const LUBRICANT_BANCHI_NUMERIC_FIELDS: string[] = [];

const safeUnlink = async (path: string): Promise<void> => {
  try {
    await fs.unlink(path);
  } catch {
    // best-effort cleanup of temp uploads; a leftover file isn't fatal
  }
};

/** Parses both uploaded files, matches them by invoice_number, and returns the merged rows. */
export const processLubricantReportData = async ({
  sapFilePath,
  banchiFilePath,
}: UploadedFilesPayload): Promise<LubricantProcessReportResult> => {
  try {
    const [sapResult, banchiResult] = await Promise.all([
      parseWorkbook<SapLubricantRow>(sapFilePath, SAP_LUBRICANT_COLUMN_MAP, LUBRICANT_SAP_NUMERIC_FIELDS),
      parseWorkbook<BanchiLaRow>(banchiFilePath, BANCHI_LA_COLUMN_MAP, LUBRICANT_BANCHI_NUMERIC_FIELDS),
    ]);

    const { rows, summary } = matchInvoices(sapResult.rows, banchiResult.rows);
    if (rows.length === 0) {
      throw new AppError(ERROR_MESSAGES.NO_MATCHING_ROWS, HTTP_STATUS.UNPROCESSABLE_ENTITY);
    }

    const reportFileName = `lubricant-report-${Date.now()}.xlsx`;

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

export const buildLubricantReportWorkbookBuffer = async (
  result: LubricantProcessReportResult
): Promise<ExcelJS.Buffer> => {
  const workbook = await generateLubricantReportWorkbook(result.rows);
  return workbook.xlsx.writeBuffer();
};
