/*
  Warnings:

  - You are about to drop the column `admins` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `banned` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `blocked` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `muted` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'OWNER';

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "admins",
DROP COLUMN "banned",
DROP COLUMN "blocked",
DROP COLUMN "muted";

-- AlterTable
ALTER TABLE "RoomUser" ADD COLUMN     "isBanned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isMuted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role";
