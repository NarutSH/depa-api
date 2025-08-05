-- AlterTable
ALTER TABLE "Portfolio" ADD COLUMN     "categorySlug" TEXT;

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_categorySlug_fkey" FOREIGN KEY ("categorySlug") REFERENCES "Category"("slug") ON DELETE SET NULL ON UPDATE CASCADE;
