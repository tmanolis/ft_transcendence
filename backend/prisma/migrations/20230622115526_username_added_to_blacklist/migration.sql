/*
  Warnings:

  - A unique constraint covering the columns `[userID]` on the table `jwtBlacklist` will be added. If there are existing duplicate values, this will fail.
  - The required column `userID` was added to the `jwtBlacklist` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "jwtBlacklist" ADD COLUMN     "userID" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "jwtBlacklist_userID_key" ON "jwtBlacklist"("userID");
