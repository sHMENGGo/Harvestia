/*
  Warnings:

  - You are about to drop the column `kg25` on the `Rice` table. All the data in the column will be lost.
  - You are about to drop the column `kg50` on the `Rice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Rice" DROP COLUMN "kg25",
DROP COLUMN "kg50",
ADD COLUMN     "isKg25" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isKg50" BOOLEAN NOT NULL DEFAULT false;
