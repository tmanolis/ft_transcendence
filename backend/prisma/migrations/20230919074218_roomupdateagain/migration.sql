-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "admins" TEXT[],
ADD COLUMN     "blocked" TEXT[],
ADD COLUMN     "muted" TEXT[];
