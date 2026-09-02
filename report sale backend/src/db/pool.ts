import { Pool } from "pg";
import { env } from "../config/env";

export const pool = new Pool({ connectionString: env.databaseUrl });

/** Fails fast with a clear log line if Postgres isn't reachable at boot, instead of a cryptic error on first request. */
export const verifyDbConnection = async (): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query("SELECT 1");
    console.log("[saleReport] Connected to PostgreSQL");
  } finally {
    client.release();
  }
};
