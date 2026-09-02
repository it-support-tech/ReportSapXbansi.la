-- Ran automatically by the postgres container on first start
-- (mounted into /docker-entrypoint-initdb.d). Re-run manually with
-- `psql -f init.sql` if you're pointing at an existing database.

CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY,
  report_file_name TEXT NOT NULL,
  summary JSONB NOT NULL,
  warnings JSONB NOT NULL DEFAULT '[]'::jsonb,
  rows JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports (created_at DESC);
