/*
  Warnings:

  - A unique constraint covering the columns `[jwtToken]` on the table `Blacklist` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Blacklist_jwtToken_key" ON "Blacklist"("jwtToken");
