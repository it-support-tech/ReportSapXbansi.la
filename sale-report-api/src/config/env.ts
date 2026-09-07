/**
 * Hardcoded config — no .env file, matches exactly what docker-compose.yml
 * passes in for local dev. Deploying to the VPS (no Docker there): edit
 * `db.host` below ("postgres" only resolves inside the Docker network — use
 * "localhost" or the real Postgres host on the VPS) and `corsOrigin`
 * (production domain) directly, then rebuild.
 */
export const env = {
  port: 4000,
  nodeEnv: "development" as string,
  corsOrigin: "http://localhost:5173",
  maxFileSizeMb: 15,
  db: {
    host: "postgres",
    port: 5432,
    user: "salereport",
    password: "salereport",
    database: "salereport",
  },
};

export const isProduction = env.nodeEnv === "production";
