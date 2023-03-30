-- AlterTable
ALTER TABLE "Circle" ADD COLUMN     "codeExpiresAt" TIMESTAMP(3) NOT NULL DEFAULT now() + interval '3 days';
