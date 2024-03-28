/*
  Warnings:

  - You are about to drop the column `location` on the `Favorite` table. All the data in the column will be lost.
  - Added the required column `locationCoord` to the `Favorite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationId` to the `Favorite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Favorite" DROP COLUMN "location",
ADD COLUMN     "locationCoord" TEXT NOT NULL,
ADD COLUMN     "locationId" TEXT NOT NULL;
