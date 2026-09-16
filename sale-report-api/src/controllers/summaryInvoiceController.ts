import { Request, Response } from "express";
import crypto from "crypto";
import fs from "fs/promises";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import { AppError } from "../utils/AppError";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { HTTP_STATUS } from "../constants/statusCodes";
import {
  processSummaryInvoiceReportData,
  buildSummaryInvoiceReportWorkbookBuffer,
  SUMMARY_INVOICE_SAP_NUMERIC_FIELDS,
} from "../services/summaryInvoiceProcessingService";
import { parseWorkbook } from "../services/excelParserService";
import { SAP_SUMMARY_INVOICE_COLUMN_MAP } from "../constants/summaryInvoiceExcelMap";
import { SapSummaryInvoiceRow } from "../types/summaryInvoiceExcel.types";
import { getSummaryInvoiceReport, saveSummaryInvoiceReport } from "../services/summaryInvoiceReportStoreService";

type UploadedFields = Record<string, Express.Multer.File[]>;

/** POST /api/summary-invoice/process — upload SAP B1 + ບັນຊີ.la files, returns a preview + reportId. */
export const processSummaryInvoiceReport = asyncHandler(async (req: Request, res: Response) => {
  const files = req.files as UploadedFields | undefined;
  const sapFile = files?.sapFile?.[0];
  const banchiFile = files?.banchiFile?.[0];

  if (!sapFile || !banchiFile) {
    throw new AppError(ERROR_MESSAGES.NO_FILES_UPLOADED, HTTP_STATUS.BAD_REQUEST);
  }

  const result = await processSummaryInvoiceReportData({
    sapFilePath: sapFile.path,
    banchiFilePath: banchiFile.path,
  });

  const reportId = crypto.randomUUID();
  await saveSummaryInvoiceReport(reportId, result);

  sendSuccess(res, {
    reportId,
    summary: result.summary,
    warnings: result.warnings,
    rows: result.rows,
    reportFileName: result.reportFileName,
  });
});

/** POST /api/summary-invoice/debug/sap — parses ONLY the SAP B1 file, no ບັນຊີ.la, no matching. */
export const debugParseSummaryInvoiceSap = asyncHandler(async (req: Request, res: Response) => {
  const files = req.files as UploadedFields | undefined;
  const sapFile = files?.sapFile?.[0];

  if (!sapFile) {
    throw new AppError(ERROR_MESSAGES.NO_FILES_UPLOADED, HTTP_STATUS.BAD_REQUEST);
  }

  try {
    const result = await parseWorkbook<SapSummaryInvoiceRow>(
      sapFile.path,
      SAP_SUMMARY_INVOICE_COLUMN_MAP,
      SUMMARY_INVOICE_SAP_NUMERIC_FIELDS
    );
    sendSuccess(res, result);
  } finally {
    await fs.unlink(sapFile.path).catch(() => {});
  }
});

/** GET /api/summary-invoice/:reportId/download — streams the generated .xlsx (one sheet per customer) for a previously processed report. */
export const downloadSummaryInvoiceReport = asyncHandler(async (req: Request, res: Response) => {
  const { reportId } = req.params;
  const result = await getSummaryInvoiceReport(reportId);

  if (!result) {
    throw new AppError("ບໍ່ພົບຂໍ້ມູນ Report ນີ້ (ອາດໝົດອາຍຸ), ກະລຸນາອັບໂຫຼດໄຟລ໌ໃໝ່", HTTP_STATUS.NOT_FOUND);
  }

  const buffer = await buildSummaryInvoiceReportWorkbookBuffer(result);

  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", `attachment; filename="${result.reportFileName}"`);
  res.send(Buffer.from(buffer));
});
