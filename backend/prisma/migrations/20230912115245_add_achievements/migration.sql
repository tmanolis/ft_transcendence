/*
  Warnings:

  - The `achievements` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Achievement" AS ENUM ('WINNER', 'FRIEND', 'STUD42', 'FIVE', 'FIRST');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "achievements",
ADD COLUMN     "achievements" "Achievement"[];
