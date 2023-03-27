/*
  Warnings:

  - A unique constraint covering the columns `[userId,circleId]` on the table `CircleMembers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CircleMembers_userId_circleId_key" ON "CircleMembers"("userId", "circleId");
