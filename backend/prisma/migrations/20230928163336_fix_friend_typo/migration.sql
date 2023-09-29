/*
  Warnings:

  - You are about to drop the column `ranking` on the `User` table. All the data in the column will be lost.
  - Made the column `gamesLost` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gamesWon` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "ranking",
ALTER COLUMN "gamesLost" SET NOT NULL,
ALTER COLUMN "gamesLost" SET DEFAULT 0,
ALTER COLUMN "gamesWon" SET NOT NULL,
ALTER COLUMN "gamesWon" SET DEFAULT 0;
