import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { apiRouter } from "./routes";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandlerMiddleware";
import { verifyDbConnection } from "./db/pool";

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const RETRY_ATTEMPTS = 10;
const RETRY_DELAY_MS = 2000;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Postgres can still be booting when this container starts (esp. outside docker-compose's healthcheck gate). */
const waitForDb = async (): Promise<void> => {
  for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt++) {
    try {
      await verifyDbConnection();
      return;
    } catch (error) {
      console.warn(`[saleReport] PostgreSQL not ready (attempt ${attempt}/${RETRY_ATTEMPTS}): ${(error as Error).message}`);
      await sleep(RETRY_DELAY_MS);
    }
  }
  console.error("[saleReport] Could not connect to PostgreSQL, starting anyway — DB-backed routes will fail");
};

waitForDb().then(() => {
  app.listen(env.port, () => {
    console.log(`[saleReport] API listening on http://localhost:${env.port} (${env.nodeEnv})`);
  });
});
