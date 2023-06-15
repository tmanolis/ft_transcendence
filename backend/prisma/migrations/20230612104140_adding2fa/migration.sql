/*
  Warnings:

  - You are about to drop the column `twoFA` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "twoFA",
ADD COLUMN     "twoFAActivated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFASecret" TEXT;
