/*
  Warnings:

  - You are about to drop the column `codeExpiresAt` on the `Circle` table. All the data in the column will be lost.
  - You are about to drop the column `lastSeen` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Circle" DROP COLUMN "codeExpiresAt";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "lastSeen";

-- CreateTable
CREATE TABLE "Devices" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "device_type" TEXT NOT NULL,
    "device_version" TEXT NOT NULL,
    "app_version" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Devices_id_key" ON "Devices"("id");

-- AddForeignKey
ALTER TABLE "Devices" ADD CONSTRAINT "Devices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
