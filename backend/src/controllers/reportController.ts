import { Request, Response } from "express";
import crypto from "crypto";
import fs from "fs/promises";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import { AppError } from "../utils/AppError";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { HTTP_STATUS } from "../constants/statusCodes";
import {
  processReportData,
  buildReportWorkbookBuffer,
  SAP_NUMERIC_FIELDS,
} from "../services/reportProcessingService";
import { parseWorkbook } from "../services/excelParserService";
import { SAP_B1_COLUMN_MAP } from "../constants/excelMap";
import { SapB1Row } from "../types/excel.types";
import { getReport, saveReport } from "../services/reportStoreService";

type UploadedFields = Record<string, Express.Multer.File[]>;

/** POST /api/reports/process — upload SAP B1 + ບັນຊີ.la files, returns a preview + reportId. */
export const processReport = asyncHandler(async (req: Request, res: Response) => {
  const files = req.files as UploadedFields | undefined;
  const sapFile = files?.sapFile?.[0];
  const banchiFile = files?.banchiFile?.[0];

  if (!sapFile || !banchiFile) {
    throw new AppError(ERROR_MESSAGES.NO_FILES_UPLOADED, HTTP_STATUS.BAD_REQUEST);
  }

  const result = await processReportData({
    sapFilePath: sapFile.path,
    banchiFilePath: banchiFile.path,
  });

  const reportId = crypto.randomUUID();
  await saveReport(reportId, result);

  sendSuccess(res, {
    reportId,
    summary: result.summary,
    warnings: result.warnings,
    rows: result.rows,
    reportFileName: result.reportFileName,
  });
});

/**
 * POST /api/reports/debug/sap — parses ONLY the SAP B1 file (no ບັນຊີ.la, no
 * matching) so the SAP extraction step can be verified on its own before
 * moving on to the invoice-number matching step.
 */
export const debugParseSap = asyncHandler(async (req: Request, res: Response) => {
  const files = req.files as UploadedFields | undefined;
  const sapFile = files?.sapFile?.[0];

  if (!sapFile) {
    throw new AppError(ERROR_MESSAGES.NO_FILES_UPLOADED, HTTP_STATUS.BAD_REQUEST);
  }

  try {
    const result = await parseWorkbook<SapB1Row>(sapFile.path, SAP_B1_COLUMN_MAP, SAP_NUMERIC_FIELDS);
    sendSuccess(res, result);
  } finally {
    await fs.unlink(sapFile.path).catch(() => {});
  }
});

/** GET /api/reports/:reportId/download — streams the generated .xlsx for a previously processed report. */
export const downloadReport = asyncHandler(async (req: Request, res: Response) => {
  const { reportId } = req.params;
  const result = await getReport(reportId);

  if (!result) {
    throw new AppError("ບໍ່ພົບຂໍ້ມູນ Report ນີ້ (ອາດໝົດອາຍຸ), ກະລຸນາອັບໂຫຼດໄຟລ໌ໃໝ່", HTTP_STATUS.NOT_FOUND);
  }

  const buffer = await buildReportWorkbookBuffer(result);

  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", `attachment; filename="${result.reportFileName}"`);
  res.send(Buffer.from(buffer));
});
