import { Router } from "express";
import { debugParseSap, downloadReport, processReport } from "../controllers/reportController";
import { uploadFiles } from "../middlewares/uploadMiddleware";

export const reportRoutes = Router();

reportRoutes.post("/process", uploadFiles, processReport);
reportRoutes.post("/debug/sap", uploadFiles, debugParseSap);
reportRoutes.get("/:reportId/download", downloadReport);
