/*
  Warnings:

  - A unique constraint covering the columns `[certificate_number]` on the table `certificates` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `certificate_number` to the `certificates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "certificates" ADD COLUMN     "certificate_number" TEXT NOT NULL,
ADD COLUMN     "qr_validation_url" TEXT,
ADD COLUMN     "verification_hash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "certificates_certificate_number_key" ON "certificates"("certificate_number");
