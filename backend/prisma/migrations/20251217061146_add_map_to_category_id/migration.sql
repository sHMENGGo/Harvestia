/*
  Warnings:

  - You are about to drop the column `categoryID` on the `Rice` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Rice" DROP CONSTRAINT "Rice_categoryID_fkey";

-- AlterTable
ALTER TABLE "Rice" DROP COLUMN "categoryID",
ADD COLUMN     "categoryid" INTEGER;

-- AddForeignKey
ALTER TABLE "Rice" ADD CONSTRAINT "Rice_categoryid_fkey" FOREIGN KEY ("categoryid") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
