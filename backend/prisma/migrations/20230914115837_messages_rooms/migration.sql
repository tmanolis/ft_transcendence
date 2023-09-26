/*
  Warnings:

  - You are about to drop the column `chatId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `sendTime` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `Chat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ChatUsers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `roomID` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_chatId_fkey";

-- DropForeignKey
ALTER TABLE "_ChatUsers" DROP CONSTRAINT "_ChatUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChatUsers" DROP CONSTRAINT "_ChatUsers_B_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "chatId",
DROP COLUMN "createdAt",
DROP COLUMN "sendTime",
DROP COLUMN "senderId",
ADD COLUMN     "roomID" TEXT NOT NULL,
ADD COLUMN     "sender" TEXT NOT NULL,
ADD COLUMN     "sendtime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Chat";

-- DropTable
DROP TABLE "_ChatUsers";

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomUser" (
    "id" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "roomID" TEXT NOT NULL,

    CONSTRAINT "RoomUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_id_key" ON "Room"("id");

-- CreateIndex
CREATE UNIQUE INDEX "RoomUser_id_key" ON "RoomUser"("id");

-- AddForeignKey
ALTER TABLE "RoomUser" ADD CONSTRAINT "RoomUser_roomID_fkey" FOREIGN KEY ("roomID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomUser" ADD CONSTRAINT "RoomUser_userID_fkey" FOREIGN KEY ("userID") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_roomID_fkey" FOREIGN KEY ("roomID") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
