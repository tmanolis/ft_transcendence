/*
  Warnings:

  - You are about to drop the column `friendRequestsReceived` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `friendRequestsSent` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "friendRequestsReceived",
DROP COLUMN "friendRequestsSent",
ADD COLUMN     "frienRequestsSent" TEXT[],
ADD COLUMN     "friendReqestsReceived" TEXT[],
ALTER COLUMN "avatar" SET DEFAULT 'defaultAvatar.jpg';
