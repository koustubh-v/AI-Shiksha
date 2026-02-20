-- AlterTable
ALTER TABLE "franchises" ADD COLUMN     "description" TEXT,
ADD COLUMN     "favicon_url" TEXT,
ADD COLUMN     "maintenance_mode" BOOLEAN NOT NULL DEFAULT false;
