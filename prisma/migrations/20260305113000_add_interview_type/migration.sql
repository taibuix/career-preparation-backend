-- CreateEnum
CREATE TYPE "InterviewType" AS ENUM ('TECHNICAL', 'BEHAVIORAL', 'MIXED');

-- AlterTable
ALTER TABLE "InterviewSession"
ADD COLUMN "interviewType" "InterviewType" NOT NULL DEFAULT 'TECHNICAL';
