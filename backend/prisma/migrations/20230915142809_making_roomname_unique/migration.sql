/*
  Warnings:

  - A unique constraint covering the columns `[roomID]` on the table `Message` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Message_roomID_key" ON "Message"("roomID");
