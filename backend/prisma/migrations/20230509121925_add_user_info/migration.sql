-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isFourtyTwoStudent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isOnline" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "name" DROP NOT NULL;
