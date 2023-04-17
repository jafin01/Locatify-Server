-- AlterTable
ALTER TABLE "Circle" ALTER COLUMN "codeExpiresAt" SET DEFAULT now() + interval '3 days';
