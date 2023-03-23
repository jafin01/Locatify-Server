/*
  Warnings:

  - Added the required column `role` to the `CircleMembers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('father', 'mother', 'sister', 'brother', 'aunty', 'uncle', 'friend');

-- AlterTable
ALTER TABLE "CircleMembers" ADD COLUMN     "role" "MemberRole" NOT NULL;
