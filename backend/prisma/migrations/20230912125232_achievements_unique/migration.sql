/*
  Warnings:

  - A unique constraint covering the columns `[achievements]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_achievements_key" ON "User"("achievements");
