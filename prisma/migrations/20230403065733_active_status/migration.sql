-- AlterTable
ALTER TABLE "Circle" ALTER COLUMN "codeExpiresAt" SET DEFAULT now() + interval '3 days';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "activeStatus" TEXT NOT NULL DEFAULT 'Online';
