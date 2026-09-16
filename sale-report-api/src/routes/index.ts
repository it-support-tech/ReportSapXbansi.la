import { Router } from "express";
import { reportRoutes } from "./reportRoutes";
import { lubricantRoutes } from "./lubricantRoutes";
import { summaryInvoiceRoutes } from "./summaryInvoiceRoutes";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => res.json({ success: true, data: { status: "ok" } }));
apiRouter.use("/reports", reportRoutes);
apiRouter.use("/lubricant", lubricantRoutes);
apiRouter.use("/summary-invoice", summaryInvoiceRoutes);
