-- WARNING: This migration permanently drops existing customer email and address data.
-- Back up or export customer email/address values before applying if they must be retained.

ALTER TABLE "customers"
  DROP COLUMN IF EXISTS "email",
  DROP COLUMN IF EXISTS "address",
  ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;
