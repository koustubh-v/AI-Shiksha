-- AlterTable
ALTER TABLE "franchises" ADD COLUMN     "gemini_api_key" TEXT,
ADD COLUMN     "global_ai_control" BOOLEAN NOT NULL DEFAULT true;
