-- AlterTable
ALTER TABLE "Circle" ALTER COLUMN "codeExpiresAt" SET DEFAULT now() + interval '3 days';

-- CreateTable
CREATE TABLE "Session_Time" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "in_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "out_time" TIMESTAMP(3)
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_Time_id_key" ON "Session_Time"("id");

-- AddForeignKey
ALTER TABLE "Session_Time" ADD CONSTRAINT "Session_Time_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
