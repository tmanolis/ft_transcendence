/*
  Warnings:

  - You are about to drop the `RoomUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RoomUser" DROP CONSTRAINT "RoomUser_email_fkey";

-- DropForeignKey
ALTER TABLE "RoomUser" DROP CONSTRAINT "RoomUser_roomID_fkey";

-- DropTable
DROP TABLE "RoomUser";

-- CreateTable
CREATE TABLE "UserInRoom" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "roomID" TEXT NOT NULL,
    "isMuted" BOOLEAN NOT NULL DEFAULT false,
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "UserInRoom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserInRoom_id_key" ON "UserInRoom"("id");

-- AddForeignKey
ALTER TABLE "UserInRoom" ADD CONSTRAINT "UserInRoom_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInRoom" ADD CONSTRAINT "UserInRoom_roomID_fkey" FOREIGN KEY ("roomID") REFERENCES "Room"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
