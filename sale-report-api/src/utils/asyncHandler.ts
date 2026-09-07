import { NextFunction, Request, Response } from "express";

type AsyncRouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

/** Wraps an async Express handler so rejected promises reach errorHandler instead of hanging the request. */
export const asyncHandler =
  (handler: AsyncRouteHandler) =>
  (req: Request, res: Response, next: NextFunction): void => {
    handler(req, res, next).catch(next);
  };
