/*
  Warnings:

  - You are about to drop the column `blocking` on the `BlockedUser` table. All the data in the column will be lost.
  - Added the required column `blocked` to the `BlockedUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BlockedUser" DROP CONSTRAINT "BlockedUser_blocking_fkey";

-- AlterTable
ALTER TABLE "BlockedUser" DROP COLUMN "blocking",
ADD COLUMN     "blocked" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "BlockedUser" ADD CONSTRAINT "BlockedUser_blocked_fkey" FOREIGN KEY ("blocked") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
