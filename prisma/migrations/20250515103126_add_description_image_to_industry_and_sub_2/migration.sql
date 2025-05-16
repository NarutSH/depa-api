/*
  Warnings:

  - You are about to drop the column `industryId` on the `UserIndustry` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,industrySlug]` on the table `UserIndustry` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `industrySlug` to the `UserIndustry` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserIndustry" DROP CONSTRAINT "UserIndustry_industryId_fkey";

-- DropIndex
DROP INDEX "UserIndustry_userId_industryId_key";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "description" TEXT,
ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "description" TEXT,
ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "Industry" ADD COLUMN     "color" TEXT DEFAULT '#789DBC',
ADD COLUMN     "description" TEXT,
ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "Segment" ADD COLUMN     "description" TEXT,
ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "Source" ADD COLUMN     "description" TEXT,
ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "UserIndustry" DROP COLUMN "industryId",
ADD COLUMN     "industrySlug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserIndustry_userId_industrySlug_key" ON "UserIndustry"("userId", "industrySlug");

-- AddForeignKey
ALTER TABLE "UserIndustry" ADD CONSTRAINT "UserIndustry_industrySlug_fkey" FOREIGN KEY ("industrySlug") REFERENCES "Industry"("slug") ON DELETE CASCADE ON UPDATE CASCADE;
