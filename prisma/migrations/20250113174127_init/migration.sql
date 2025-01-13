-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('company', 'freelance', 'guest');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "fullnameTh" TEXT NOT NULL,
    "fullnameEn" TEXT,
    "about" TEXT,
    "phoneNumber" TEXT,
    "email" TEXT,
    "website" TEXT,
    "location" TEXT,
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
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "CompanyRevenue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FreelanceRevenue" (
    "id" UUID NOT NULL,
    "year" INTEGER NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "freelanceId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

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
    "segment" TEXT NOT NULL,
    "percent" DOUBLE PRECISION NOT NULL,
    "ctrPercent" DOUBLE PRECISION NOT NULL,
    "value" DOUBLE PRECISION,
    "companyId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "RevenueStream_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" UUID NOT NULL,
    "juristicId" TEXT NOT NULL,
    "nameTh" TEXT NOT NULL,
    "nameEn" TEXT,
    "description" TEXT,
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
    "updatedAt" TIMESTAMPTZ NOT NULL,
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
    "address" TEXT,
    "subDistrict" TEXT,
    "district" TEXT,
    "province" TEXT,
    "postalCode" TEXT,
    "phoneNumber" TEXT,
    "email" TEXT,
    "juristicId" TEXT,
    "industryTypes" TEXT[],
    "skills" TEXT[],
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "Freelance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyRevenue_companyId_year_key" ON "CompanyRevenue"("companyId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "FreelanceRevenue_freelanceId_year_key" ON "FreelanceRevenue"("freelanceId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "RevenueStream_companyId_year_industryTypeSlug_categorySlug__key" ON "RevenueStream"("companyId", "year", "industryTypeSlug", "categorySlug", "sourceSlug", "channelSlug", "segment");

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

-- AddForeignKey
ALTER TABLE "CompanyRevenue" ADD CONSTRAINT "CompanyRevenue_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FreelanceRevenue" ADD CONSTRAINT "FreelanceRevenue_freelanceId_fkey" FOREIGN KEY ("freelanceId") REFERENCES "Freelance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevenueStream" ADD CONSTRAINT "RevenueStream_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Freelance" ADD CONSTRAINT "Freelance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
