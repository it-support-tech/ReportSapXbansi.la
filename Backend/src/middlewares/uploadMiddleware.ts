import multer from "multer";
import path from "path";
import os from "os";
import crypto from "crypto";
import { Request } from "express";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { HTTP_STATUS } from "../constants/statusCodes";

const ALLOWED_EXTENSIONS = new Set([".xlsx", ".xls"]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, os.tmpdir()),
  filename: (_req, file, cb) => {
    const unique = crypto.randomUUID();
    cb(null, `salereport-${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback): void => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    cb(new AppError(ERROR_MESSAGES.INVALID_FILE_TYPE, HTTP_STATUS.BAD_REQUEST));
    return;
  }
  cb(null, true);
};

export const uploadFiles = multer({
  storage,
  fileFilter,
  limits: { fileSize: env.maxFileSizeMb * 1024 * 1024 },
}).fields([
  { name: "sapFile", maxCount: 1 },
  { name: "banchiFile", maxCount: 1 },
]);
