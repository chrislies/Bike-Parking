-- CreateTable
CREATE TABLE "favorite_table" (
    "id" SERIAL NOT NULL,
    "x_coordinate" DOUBLE PRECISION NOT NULL,
    "y_coordinate" DOUBLE PRECISION NOT NULL,
    "site_id" TEXT NOT NULL,
    "racktype" TEXT NOT NULL,
    "ifoaddress" TEXT NOT NULL,
    "userid" INTEGER NOT NULL,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);
