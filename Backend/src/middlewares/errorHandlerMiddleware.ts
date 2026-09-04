import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { AppError } from "../utils/AppError";
import { sendError } from "../utils/apiResponse";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { HTTP_STATUS } from "../constants/statusCodes";

export const notFoundHandler = (req: Request, res: Response): void => {
  sendError(res, HTTP_STATUS.NOT_FOUND, `ບໍ່ພົບເສັ້ນທາງ: ${req.method} ${req.originalUrl}`);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof AppError) {
    sendError(res, err.status, err.message, err.details);
    return;
  }

  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE" ? ERROR_MESSAGES.FILE_TOO_LARGE : ERROR_MESSAGES.INVALID_FILE_TYPE;
    sendError(res, HTTP_STATUS.BAD_REQUEST, message);
    return;
  }

  console.error("[Unhandled Error]", err);
  sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
};
