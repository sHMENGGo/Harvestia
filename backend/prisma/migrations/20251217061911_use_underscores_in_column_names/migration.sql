/*
  Warnings:

  - You are about to drop the column `categoryid` on the `Rice` table. All the data in the column will be lost.
  - You are about to drop the column `imagePath` on the `Rice` table. All the data in the column will be lost.
  - You are about to drop the column `imagePublicID` on the `Rice` table. All the data in the column will be lost.
  - You are about to drop the column `isAvailable` on the `Rice` table. All the data in the column will be lost.
  - You are about to drop the column `isKg25` on the `Rice` table. All the data in the column will be lost.
  - You are about to drop the column `isKg50` on the `Rice` table. All the data in the column will be lost.
  - You are about to drop the column `weightKG` on the `Rice` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Rice" DROP CONSTRAINT "Rice_categoryid_fkey";

-- AlterTable
ALTER TABLE "Rice" DROP COLUMN "categoryid",
DROP COLUMN "imagePath",
DROP COLUMN "imagePublicID",
DROP COLUMN "isAvailable",
DROP COLUMN "isKg25",
DROP COLUMN "isKg50",
DROP COLUMN "weightKG",
ADD COLUMN     "category_id" INTEGER,
ADD COLUMN     "image_path" TEXT,
ADD COLUMN     "image_public_id" TEXT,
ADD COLUMN     "is_25kg" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_50kg" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_available" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "weight_kg" DOUBLE PRECISION;

-- AddForeignKey
ALTER TABLE "Rice" ADD CONSTRAINT "Rice_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
