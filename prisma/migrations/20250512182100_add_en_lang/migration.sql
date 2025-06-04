/*
  Warnings:

  - A unique constraint covering the columns `[companyId,year,industryTypeSlug,categorySlug,sourceSlug,channelSlug,segmentSlug]` on the table `RevenueStream` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyId` to the `RevenueStream` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RevenueStream" DROP CONSTRAINT "RevenueStream_companyJuristicId_fkey";

-- DropIndex
DROP INDEX "RevenueStream_companyJuristicId_year_industryTypeSlug_categ_key";

-- AlterTable
ALTER TABLE "Portfolio" ADD COLUMN     "description_en" TEXT,
ADD COLUMN     "title_en" TEXT;

-- AlterTable
ALTER TABLE "RevenueStream" ADD COLUMN     "companyId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RevenueStream_companyId_year_industryTypeSlug_categorySlug__key" ON "RevenueStream"("companyId", "year", "industryTypeSlug", "categorySlug", "sourceSlug", "channelSlug", "segmentSlug");

-- AddForeignKey
ALTER TABLE "RevenueStream" ADD CONSTRAINT "RevenueStream_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
