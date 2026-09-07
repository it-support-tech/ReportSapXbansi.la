import { Pool } from "pg";

export const pool = new Pool({
  host: "localhost", 
  port: 5432,
  user: "ntp2026",
  password: "admin@123#",
  database: "reportSale",
});

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
