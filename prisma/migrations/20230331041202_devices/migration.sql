-- AlterTable
ALTER TABLE "Circle" ALTER COLUMN "codeExpiresAt" SET DEFAULT now() + interval '3 days';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
