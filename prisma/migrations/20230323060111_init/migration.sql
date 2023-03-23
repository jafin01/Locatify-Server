/*
  Warnings:

  - The values [member] on the enum `MemberRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MemberRole_new" AS ENUM ('admin', 'father', 'mother', 'sister', 'brother', 'aunty', 'uncle', 'friend');
ALTER TABLE "CircleMembers" ALTER COLUMN "role" TYPE "MemberRole_new" USING ("role"::text::"MemberRole_new");
ALTER TYPE "MemberRole" RENAME TO "MemberRole_old";
ALTER TYPE "MemberRole_new" RENAME TO "MemberRole";
DROP TYPE "MemberRole_old";
COMMIT;
