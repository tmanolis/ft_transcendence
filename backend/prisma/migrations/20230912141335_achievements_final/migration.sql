/*
  Warnings:

  - The values [STUD42,FIVE] on the enum `Achievement` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Achievement_new" AS ENUM ('WINNER', 'FRIEND', 'TWOFA', 'JOIN', 'FIRST');
ALTER TABLE "User" ALTER COLUMN "achievements" TYPE "Achievement_new"[] USING ("achievements"::text::"Achievement_new"[]);
ALTER TYPE "Achievement" RENAME TO "Achievement_old";
ALTER TYPE "Achievement_new" RENAME TO "Achievement";
DROP TYPE "Achievement_old";
COMMIT;
