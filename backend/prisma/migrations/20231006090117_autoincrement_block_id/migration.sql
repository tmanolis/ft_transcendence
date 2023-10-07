/*
  Warnings:

  - The primary key for the `BlockedUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `BlockedUser` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "BlockedUser" DROP CONSTRAINT "BlockedUser_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "BlockedUser_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "BlockedUser_id_key" ON "BlockedUser"("id");
