-- AlterTable
ALTER TABLE "Circle" ALTER COLUMN "codeExpiresAt" SET DEFAULT now() + interval '3 days';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "otp" TEXT,
ADD COLUMN     "otpExpiresAt" TIMESTAMP(3);
