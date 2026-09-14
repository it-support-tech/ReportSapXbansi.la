import { Router } from "express";
import { debugParseLubricantSap, downloadLubricantReport, processLubricantReport } from "../controllers/lubricantController";
import { uploadFiles } from "../middlewares/uploadMiddleware";

export const lubricantRoutes = Router();

lubricantRoutes.post("/process", uploadFiles, processLubricantReport);
lubricantRoutes.post("/debug/sap", uploadFiles, debugParseLubricantSap);
lubricantRoutes.get("/:reportId/download", downloadLubricantReport);
