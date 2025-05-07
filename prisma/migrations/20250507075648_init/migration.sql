-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('company', 'freelance', 'guest', 'admin');

-- CreateEnum
CREATE TYPE "PortfolioImageType" AS ENUM ('cover', 'gallery', 'main');

-- CreateEnum
CREATE TYPE "FavoriteAction" AS ENUM ('favorite', 'unfavorite');

-- CreateEnum
CREATE TYPE "StandardsType" AS ENUM ('ERSB', 'PEGI', 'CERO', 'USK', 'ACB', 'IARC', 'GRAC', 'VSC', 'OFLC', 'BBFC', 'FPB', 'RARS', 'GSRB', 'GSRR', 'MPA', 'EIRIN', 'NBTC', 'ESRB');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "fullnameTh" TEXT NOT NULL,
    "fullnameEn" TEXT,
    "about" TEXT,
    "phoneNumber" TEXT,
    "email" TEXT,
    "website" TEXT,
    "address" TEXT,
    "image" TEXT,
    "industries" TEXT[],
    "tags" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "channels" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "specialists" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "userType" "UserType" DEFAULT 'guest',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyRevenue" (
    "id" UUID NOT NULL,
    "year" INTEGER NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "companyId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompanyRevenue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FreelanceRevenue" (
    "id" UUID NOT NULL,
    "year" INTEGER NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "freelanceId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FreelanceRevenue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RevenueStream" (
    "id" UUID NOT NULL,
    "year" INTEGER NOT NULL,
    "industryTypeSlug" TEXT NOT NULL,
    "categorySlug" TEXT NOT NULL,
    "sourceSlug" TEXT NOT NULL,
    "channelSlug" TEXT NOT NULL,
    "segmentSlug" TEXT NOT NULL,
    "percent" DOUBLE PRECISION NOT NULL,
    "ctrPercent" DOUBLE PRECISION NOT NULL,
    "value" DOUBLE PRECISION,
    "companyJuristicId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RevenueStream_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" UUID NOT NULL,
    "juristicId" TEXT NOT NULL,
    "nameTh" TEXT NOT NULL,
    "nameEn" TEXT,
    "description" TEXT,
    "image" TEXT,
    "cover_image" TEXT,
    "address" TEXT,
    "subDistrict" TEXT,
    "district" TEXT,
    "province" TEXT,
    "postalCode" TEXT,
    "registerdCapital" DOUBLE PRECISION,
    "employeeCount" INTEGER,
    "phoneNumber" TEXT,
    "email" TEXT,
    "website" TEXT,
    "logo" TEXT,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "industries" TEXT[],

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Freelance" (
    "id" UUID NOT NULL,
    "firstNameTh" TEXT NOT NULL,
    "lastNameTh" TEXT NOT NULL,
    "firstNameEn" TEXT,
    "lastNameEn" TEXT,
    "image" TEXT,
    "cover_image" TEXT,
    "address" TEXT,
    "subDistrict" TEXT,
    "district" TEXT,
    "province" TEXT,
    "postalCode" TEXT,
    "phoneNumber" TEXT,
    "email" TEXT,
    "juristicId" TEXT,
    "industryTypes" TEXT[],
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL,

    CONSTRAINT "Freelance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Industry" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Industry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "industrySlug" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Source" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "industrySlug" TEXT NOT NULL,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "industrySlug" TEXT NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Segment" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "industrySlug" TEXT NOT NULL,

    CONSTRAINT "Segment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Portfolio" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "cover_image" TEXT,
    "link" TEXT,
    "industryTypeSlug" TEXT NOT NULL,
    "tags" TEXT[],
    "looking_for" TEXT[],
    "freelanceId" UUID,
    "companyId" UUID,
    "companyJuristicId" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioStandards" (
    "id" UUID NOT NULL,
    "portfolioId" UUID NOT NULL,
    "standardsId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PortfolioStandards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioImage" (
    "id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "type" "PortfolioImageType" NOT NULL DEFAULT 'gallery',
    "portfolioId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PortfolioImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" UUID NOT NULL,
    "portfolioId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "action" "FavoriteAction" NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Standards" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "StandardsType" NOT NULL,
    "industrySlug" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Standards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "group" TEXT,
    "industrySlug" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "freelanceId" UUID,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioComment" (
    "id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "portfolioId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "parentId" UUID,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PortfolioComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyRevenue_companyId_year_key" ON "CompanyRevenue"("companyId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "FreelanceRevenue_freelanceId_year_key" ON "FreelanceRevenue"("freelanceId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "RevenueStream_companyJuristicId_year_industryTypeSlug_categ_key" ON "RevenueStream"("companyJuristicId", "year", "industryTypeSlug", "categorySlug", "sourceSlug", "channelSlug", "segmentSlug");

-- CreateIndex
CREATE UNIQUE INDEX "Company_juristicId_key" ON "Company"("juristicId");

-- CreateIndex
CREATE UNIQUE INDEX "Company_userId_key" ON "Company"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Freelance_email_key" ON "Freelance"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Freelance_juristicId_key" ON "Freelance"("juristicId");

-- CreateIndex
CREATE UNIQUE INDEX "Freelance_userId_key" ON "Freelance"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Industry_slug_key" ON "Industry"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_industrySlug_key" ON "Category"("slug", "industrySlug");

-- CreateIndex
CREATE UNIQUE INDEX "Source_slug_industrySlug_key" ON "Source"("slug", "industrySlug");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_slug_industrySlug_key" ON "Channel"("slug", "industrySlug");

-- CreateIndex
CREATE UNIQUE INDEX "Segment_slug_key" ON "Segment"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Segment_slug_industrySlug_key" ON "Segment"("slug", "industrySlug");

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioStandards_portfolioId_standardsId_key" ON "PortfolioStandards"("portfolioId", "standardsId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_portfolioId_key" ON "Favorite"("userId", "portfolioId");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_slug_industrySlug_key" ON "Skill"("slug", "industrySlug");

-- AddForeignKey
ALTER TABLE "CompanyRevenue" ADD CONSTRAINT "CompanyRevenue_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FreelanceRevenue" ADD CONSTRAINT "FreelanceRevenue_freelanceId_fkey" FOREIGN KEY ("freelanceId") REFERENCES "Freelance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevenueStream" ADD CONSTRAINT "RevenueStream_industryTypeSlug_fkey" FOREIGN KEY ("industryTypeSlug") REFERENCES "Industry"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevenueStream" ADD CONSTRAINT "RevenueStream_categorySlug_industryTypeSlug_fkey" FOREIGN KEY ("categorySlug", "industryTypeSlug") REFERENCES "Category"("slug", "industrySlug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevenueStream" ADD CONSTRAINT "RevenueStream_sourceSlug_industryTypeSlug_fkey" FOREIGN KEY ("sourceSlug", "industryTypeSlug") REFERENCES "Source"("slug", "industrySlug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevenueStream" ADD CONSTRAINT "RevenueStream_channelSlug_industryTypeSlug_fkey" FOREIGN KEY ("channelSlug", "industryTypeSlug") REFERENCES "Channel"("slug", "industrySlug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevenueStream" ADD CONSTRAINT "RevenueStream_segmentSlug_industryTypeSlug_fkey" FOREIGN KEY ("segmentSlug", "industryTypeSlug") REFERENCES "Segment"("slug", "industrySlug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevenueStream" ADD CONSTRAINT "RevenueStream_companyJuristicId_fkey" FOREIGN KEY ("companyJuristicId") REFERENCES "Company"("juristicId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Freelance" ADD CONSTRAINT "Freelance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_industrySlug_fkey" FOREIGN KEY ("industrySlug") REFERENCES "Industry"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_industrySlug_fkey" FOREIGN KEY ("industrySlug") REFERENCES "Industry"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_industrySlug_fkey" FOREIGN KEY ("industrySlug") REFERENCES "Industry"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Segment" ADD CONSTRAINT "Segment_industrySlug_fkey" FOREIGN KEY ("industrySlug") REFERENCES "Industry"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_freelanceId_fkey" FOREIGN KEY ("freelanceId") REFERENCES "Freelance"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioStandards" ADD CONSTRAINT "PortfolioStandards_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioStandards" ADD CONSTRAINT "PortfolioStandards_standardsId_fkey" FOREIGN KEY ("standardsId") REFERENCES "Standards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioImage" ADD CONSTRAINT "PortfolioImage_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Standards" ADD CONSTRAINT "Standards_industrySlug_fkey" FOREIGN KEY ("industrySlug") REFERENCES "Industry"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_industrySlug_fkey" FOREIGN KEY ("industrySlug") REFERENCES "Industry"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_freelanceId_fkey" FOREIGN KEY ("freelanceId") REFERENCES "Freelance"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioComment" ADD CONSTRAINT "PortfolioComment_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioComment" ADD CONSTRAINT "PortfolioComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioComment" ADD CONSTRAINT "PortfolioComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "PortfolioComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
