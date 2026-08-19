-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "email_status" "EmailStatus" NOT NULL DEFAULT 'PENDING';
