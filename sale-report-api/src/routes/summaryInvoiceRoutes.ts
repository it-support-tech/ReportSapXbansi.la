import { Router } from "express";
import {
  debugParseSummaryInvoiceSap,
  downloadSummaryInvoiceReport,
  processSummaryInvoiceReport,
} from "../controllers/summaryInvoiceController";
import { uploadFiles } from "../middlewares/uploadMiddleware";

export const summaryInvoiceRoutes = Router();

summaryInvoiceRoutes.post("/process", uploadFiles, processSummaryInvoiceReport);
summaryInvoiceRoutes.post("/debug/sap", uploadFiles, debugParseSummaryInvoiceSap);
summaryInvoiceRoutes.get("/:reportId/download", downloadSummaryInvoiceReport);
