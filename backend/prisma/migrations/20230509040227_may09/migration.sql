/*
  Warnings:

  - A unique constraint covering the columns `[userName]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `loserId` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "loserId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "fourtyTwoLogin" TEXT,
ADD COLUMN     "friendList" TEXT[],
ADD COLUMN     "friendRequestReceivedFrom" TEXT[],
ADD COLUMN     "friendRequestSentTo" TEXT[],
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "profilePicture" TEXT,
ADD COLUMN     "twoFAIsEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "userName" TEXT NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_loserId_fkey" FOREIGN KEY ("loserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
