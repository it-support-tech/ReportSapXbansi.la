import { Router } from "express";
import { reportRoutes } from "./reportRoutes";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => res.json({ success: true, data: { status: "ok" } }));
apiRouter.use("/reports", reportRoutes);
