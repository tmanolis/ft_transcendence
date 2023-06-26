/*
  Warnings:

  - You are about to drop the `Blacklist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Blacklist";

-- CreateTable
CREATE TABLE "jwtBlacklist" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "jwtBlacklist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "jwtBlacklist_token_key" ON "jwtBlacklist"("token");
