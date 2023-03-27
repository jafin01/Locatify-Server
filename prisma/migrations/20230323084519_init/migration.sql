/*
  Warnings:

  - The values [admin,father,mother,sister,brother,aunty,uncle,friend,member] on the enum `MemberRole` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[userId,circleId]` on the table `CircleMembers` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MemberRole_new" AS ENUM ('Admin', 'Member', 'Father', 'Mother', 'Sister', 'Brother', 'Aunty', 'Uncle', 'Friend');
ALTER TABLE "CircleMembers" ALTER COLUMN "role" TYPE "MemberRole_new" USING ("role"::text::"MemberRole_new");
ALTER TYPE "MemberRole" RENAME TO "MemberRole_old";
ALTER TYPE "MemberRole_new" RENAME TO "MemberRole";
DROP TYPE "MemberRole_old";
COMMIT;

-- CreateIndex
CREATE UNIQUE INDEX "CircleMembers_userId_circleId_key" ON "CircleMembers"("userId", "circleId");
