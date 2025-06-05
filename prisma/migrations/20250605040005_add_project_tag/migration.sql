/*
  Warnings:

  - The primary key for the `PortfolioTag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `tagSlug` on the `PortfolioTag` table. All the data in the column will be lost.
  - Added the required column `projectTagSlug` to the `PortfolioTag` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PortfolioTag" DROP CONSTRAINT "PortfolioTag_tagSlug_fkey";

-- AlterTable
ALTER TABLE "PortfolioTag" DROP CONSTRAINT "PortfolioTag_pkey",
DROP COLUMN "tagSlug",
ADD COLUMN     "projectTagSlug" TEXT NOT NULL,
ADD CONSTRAINT "PortfolioTag_pkey" PRIMARY KEY ("portfolioId", "projectTagSlug");

-- AlterTable
ALTER TABLE "UserTags" ADD COLUMN     "projectTagId" UUID;

-- CreateTable
CREATE TABLE "ProjectTag" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "industrySlug" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectTag_slug_key" ON "ProjectTag"("slug");

-- AddForeignKey
ALTER TABLE "UserTags" ADD CONSTRAINT "UserTags_projectTagId_fkey" FOREIGN KEY ("projectTagId") REFERENCES "ProjectTag"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTag" ADD CONSTRAINT "ProjectTag_industrySlug_fkey" FOREIGN KEY ("industrySlug") REFERENCES "Industry"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioTag" ADD CONSTRAINT "PortfolioTag_projectTagSlug_fkey" FOREIGN KEY ("projectTagSlug") REFERENCES "ProjectTag"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
