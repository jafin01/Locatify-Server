-- AlterTable
ALTER TABLE "Circle" ALTER COLUMN "codeExpiresAt" SET DEFAULT now() + interval '3 days';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "countryCode" TEXT NOT NULL DEFAULT '+91';
