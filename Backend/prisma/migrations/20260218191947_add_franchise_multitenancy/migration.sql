-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'SUPER_ADMIN';
ALTER TYPE "Role" ADD VALUE 'FRANCHISE_ADMIN';

-- AlterTable
ALTER TABLE "certificates" ADD COLUMN     "franchise_id" TEXT;

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "franchise_id" TEXT;

-- AlterTable
ALTER TABLE "enrollments" ADD COLUMN     "franchise_id" TEXT;

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "franchise_id" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "franchise_id" TEXT;

-- CreateTable
CREATE TABLE "franchises" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lms_name" TEXT,
    "domain" TEXT NOT NULL,
    "logo_url" TEXT,
    "primary_color" TEXT DEFAULT '#6366f1',
    "support_email" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "domain_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "franchises_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "franchises_domain_key" ON "franchises"("domain");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_franchise_id_fkey" FOREIGN KEY ("franchise_id") REFERENCES "franchises"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_franchise_id_fkey" FOREIGN KEY ("franchise_id") REFERENCES "franchises"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_franchise_id_fkey" FOREIGN KEY ("franchise_id") REFERENCES "franchises"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_franchise_id_fkey" FOREIGN KEY ("franchise_id") REFERENCES "franchises"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_franchise_id_fkey" FOREIGN KEY ("franchise_id") REFERENCES "franchises"("id") ON DELETE SET NULL ON UPDATE CASCADE;
