-- CreateTable
CREATE TABLE "Blacklist" (
    "id" SERIAL NOT NULL,
    "jwtToken" TEXT[],

    CONSTRAINT "Blacklist_pkey" PRIMARY KEY ("id")
);
