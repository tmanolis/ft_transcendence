/*
  Warnings:

  - Added the required column `owner` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('PUBLIC', 'PRIVATE', 'DIRECT');

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "owner" TEXT NOT NULL,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "status" "RoomStatus" NOT NULL DEFAULT 'PUBLIC';
