-- DropForeignKey
ALTER TABLE "RoomUser" DROP CONSTRAINT "RoomUser_userID_fkey";

-- DropForeignKey
ALTER TABLE "RoomUser" DROP CONSTRAINT "RoomUser_roomID_fkey";

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "banned",
ALTER COLUMN "status" SET DEFAULT 'PUBLIC';

-- AddForeignKey
ALTER TABLE "RoomUser" ADD CONSTRAINT "RoomUser_roomID_fkey" FOREIGN KEY ("roomID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomUser" ADD CONSTRAINT "RoomUser_userID_fkey" FOREIGN KEY ("userID") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

