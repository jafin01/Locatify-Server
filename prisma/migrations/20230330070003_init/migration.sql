/*
  Warnings:

  - You are about to drop the `Session_Time` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Session_Time" DROP CONSTRAINT "Session_Time_userId_fkey";

-- AlterTable
ALTER TABLE "Circle" ALTER COLUMN "codeExpiresAt" SET DEFAULT now() + interval '3 days';

-- DropTable
DROP TABLE "Session_Time";

-- CreateTable
CREATE TABLE "SessionTime" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "inTime" TIMESTAMP(3) NOT NULL,
    "outTime" TIMESTAMP(3)
);

-- CreateIndex
CREATE UNIQUE INDEX "SessionTime_id_key" ON "SessionTime"("id");

-- AddForeignKey
ALTER TABLE "SessionTime" ADD CONSTRAINT "SessionTime_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
