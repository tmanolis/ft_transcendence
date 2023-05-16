/*
  Warnings:

  - The primary key for the `Game` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `friendList` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `friendRequestReceivedFrom` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `friendRequestSentTo` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isOnline` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `twoFAIsEnabled` on the `User` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gamesLost` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gamesWon` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ranking` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ONLINE', 'OFFLINE', 'PLAYING');

-- AlterTable
ALTER TABLE "Game" DROP CONSTRAINT "Game_pkey",
DROP COLUMN "id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "gameId" SERIAL NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Game_pkey" PRIMARY KEY ("gameId");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "friendList",
DROP COLUMN "friendRequestReceivedFrom",
DROP COLUMN "friendRequestSentTo",
DROP COLUMN "isOnline",
DROP COLUMN "name",
DROP COLUMN "profilePicture",
DROP COLUMN "twoFAIsEnabled",
ADD COLUMN     "achievements" TEXT[],
ADD COLUMN     "avatar" TEXT NOT NULL DEFAULT 'defaultAvatar.jpg',
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "frienRequestsSent" TEXT[],
ADD COLUMN     "friendReqestsReceived" TEXT[],
ADD COLUMN     "friends" TEXT[],
ADD COLUMN     "gamesLost" INTEGER NOT NULL,
ADD COLUMN     "gamesWon" INTEGER NOT NULL,
ADD COLUMN     "level" INTEGER NOT NULL,
ADD COLUMN     "ranking" INTEGER NOT NULL,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER',
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ONLINE',
ADD COLUMN     "twoFA" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Chat" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "sendTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "senderId" TEXT NOT NULL,
    "chatId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_player" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ChatUsers" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_player_AB_unique" ON "_player"("A", "B");

-- CreateIndex
CREATE INDEX "_player_B_index" ON "_player"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ChatUsers_AB_unique" ON "_ChatUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_ChatUsers_B_index" ON "_ChatUsers"("B");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_player" ADD CONSTRAINT "_player_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("gameId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_player" ADD CONSTRAINT "_player_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatUsers" ADD CONSTRAINT "_ChatUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatUsers" ADD CONSTRAINT "_ChatUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
