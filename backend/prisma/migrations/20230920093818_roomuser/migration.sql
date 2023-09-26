/*
  Warnings:

  - You are about to drop the column `userID` on the `RoomUser` table. All the data in the column will be lost.
  - Added the required column `email` to the `RoomUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RoomUser" DROP CONSTRAINT "RoomUser_userID_fkey";

-- AlterTable
ALTER TABLE "RoomUser" DROP COLUMN "userID",
ADD COLUMN     "email" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "RoomUser" ADD CONSTRAINT "RoomUser_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
