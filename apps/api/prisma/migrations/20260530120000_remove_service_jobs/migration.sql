-- WARNING: This migration permanently drops existing service job data.
-- Back up the database before applying if service_jobs/service_job_items data must be retained.

DROP TABLE IF EXISTS "service_job_items";
DROP TABLE IF EXISTS "service_jobs";

DROP TYPE IF EXISTS "Priority";
DROP TYPE IF EXISTS "JobStatus";
