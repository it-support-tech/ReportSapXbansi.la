import axios from "axios";
import { ApiFailure } from "../types/report.types";

export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError<ApiFailure>(error)) {
    return error.response?.data?.message ?? error.message ?? fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
};
