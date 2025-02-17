-- DropForeignKey
ALTER TABLE "PortfolioStandards" DROP CONSTRAINT "PortfolioStandards_portfolioId_fkey";

-- DropForeignKey
ALTER TABLE "PortfolioStandards" DROP CONSTRAINT "PortfolioStandards_standardsId_fkey";

-- AddForeignKey
ALTER TABLE "PortfolioStandards" ADD CONSTRAINT "PortfolioStandards_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioStandards" ADD CONSTRAINT "PortfolioStandards_standardsId_fkey" FOREIGN KEY ("standardsId") REFERENCES "Standards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
