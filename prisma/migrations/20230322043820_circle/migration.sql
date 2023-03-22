/*
  Warnings:

  - Added the required column `role` to the `CircleMembers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CircleMembers" ADD COLUMN     "role" TEXT NOT NULL;
