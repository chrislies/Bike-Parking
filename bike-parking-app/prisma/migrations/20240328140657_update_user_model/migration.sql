/*
  Warnings:

  - You are about to drop the `Favorite` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "favorites" JSONB DEFAULT '{}';

-- DropTable
DROP TABLE "Favorite";
