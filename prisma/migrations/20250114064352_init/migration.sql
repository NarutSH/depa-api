/*
  Warnings:

  - You are about to drop the column `companyId` on the `RevenueStream` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[companyJuristicId,year,industryTypeSlug,categorySlug,sourceSlug,channelSlug,segment]` on the table `RevenueStream` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyJuristicId` to the `RevenueStream` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RevenueStream" DROP CONSTRAINT "RevenueStream_companyId_fkey";

-- DropIndex
DROP INDEX "RevenueStream_companyId_year_industryTypeSlug_categorySlug__key";

-- AlterTable
ALTER TABLE "RevenueStream" DROP COLUMN "companyId",
ADD COLUMN     "companyJuristicId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RevenueStream_companyJuristicId_year_industryTypeSlug_categ_key" ON "RevenueStream"("companyJuristicId", "year", "industryTypeSlug", "categorySlug", "sourceSlug", "channelSlug", "segment");

-- AddForeignKey
ALTER TABLE "RevenueStream" ADD CONSTRAINT "RevenueStream_companyJuristicId_fkey" FOREIGN KEY ("companyJuristicId") REFERENCES "Company"("juristicId") ON DELETE RESTRICT ON UPDATE CASCADE;
