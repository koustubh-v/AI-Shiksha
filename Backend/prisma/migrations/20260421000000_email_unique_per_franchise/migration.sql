-- Migration: email_unique_per_franchise
--
-- Problem: The old constraint was a global unique on email.
-- This prevents the same email existing in two different franchises.
--
-- Fix: Use TWO partial unique indexes instead of one compound index.
--
-- Why partial indexes?
-- PostgreSQL treats NULL != NULL in unique constraints.
-- So a single @@unique([email, franchise_id]) would NOT enforce uniqueness
-- for system users (franchise_id IS NULL) -- two system users could share
-- the same email because NULL != NULL in Postgres unique checks.
--
-- Solution:
--   Index 1: System users (franchise_id IS NULL) -> email must be globally unique
--   Index 2: Franchise users (franchise_id IS NOT NULL) -> email must be unique per franchise

-- Step 1: Drop the old global unique index on email
DROP INDEX IF EXISTS "users_email_key";

-- Step 2: Drop any accidental compound index if it was already created
DROP INDEX IF EXISTS "users_email_franchise_id_key";

-- Step 3: For system users (franchise_id IS NULL) -- email must be globally unique
CREATE UNIQUE INDEX "users_email_system_key"
    ON "users"("email")
    WHERE "franchise_id" IS NULL;

-- Step 4: For franchise users (franchise_id IS NOT NULL) -- email must be unique within a franchise
CREATE UNIQUE INDEX "users_email_franchise_key"
    ON "users"("email", "franchise_id")
    WHERE "franchise_id" IS NOT NULL;
