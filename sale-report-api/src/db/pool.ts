import { Pool } from "pg";

// Local Docker dev values, matching docker-compose.yml's postgres service.
// Deploying to the VPS: swap these 5 for the real Postgres already provisioned
// there (host "localhost", user "ntp2026", password "admin@123#", database "reportSale").
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
