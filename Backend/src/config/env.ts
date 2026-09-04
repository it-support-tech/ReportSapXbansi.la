/**
 * Hardcoded config — no .env file, matches exactly what docker-compose.yml
 * used to pass in. Simpler for now; revisit with real env vars if this ever
 * needs to run against a different database/host per environment.
 */
export const env = {
  port: 4000,
  nodeEnv: "development" as string,
  corsOrigin: "http://localhost:5173",
  maxFileSizeMb: 15,
  databaseUrl: "postgres://salereport:salereport@postgres:5432/salereport",
};

export const isProduction = env.nodeEnv === "production";
