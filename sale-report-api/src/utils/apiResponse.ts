import { Response } from "express";

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiFailure {
  success: false;
  message: string;
  details?: string[];
}

export const sendSuccess = <T>(res: Response, data: T, status = 200): void => {
  const body: ApiSuccess<T> = { success: true, data };
  res.status(status).json(body);
};

export const sendError = (res: Response, status: number, message: string, details?: string[]): void => {
  const body: ApiFailure = { success: false, message, details };
  res.status(status).json(body);
};
