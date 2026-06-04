-- DropForeignKey
ALTER TABLE "Resume" DROP CONSTRAINT "Resume_analysisId_fkey";

-- AlterTable
ALTER TABLE "Resume" ALTER COLUMN "analysisId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE SET NULL ON UPDATE CASCADE;
