/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Skill` will be added. If there are existing duplicate values, this will fail.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "fullnameTh" DROP NOT NULL,
ALTER COLUMN "email" SET NOT NULL;

-- CreateTable
CREATE TABLE "UserTags" (
    "userId" UUID NOT NULL,
    "tagSlug" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "UserTags_pkey" PRIMARY KEY ("userId","tagSlug")
);

-- CreateTable
CREATE TABLE "UserChannels" (
    "userId" UUID NOT NULL,
    "channelSlug" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "UserChannels_pkey" PRIMARY KEY ("userId","channelSlug")
);

-- CreateTable
CREATE TABLE "UserSkills" (
    "userId" UUID NOT NULL,
    "skillSlug" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "UserSkills_pkey" PRIMARY KEY ("userId","skillSlug")
);

-- CreateTable
CREATE TABLE "UserIndustry" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "industryId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "UserIndustry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserIndustry_userId_industryId_key" ON "UserIndustry"("userId", "industryId");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_slug_key" ON "Skill"("slug");

-- AddForeignKey
ALTER TABLE "UserTags" ADD CONSTRAINT "UserTags_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTags" ADD CONSTRAINT "UserTags_tagSlug_fkey" FOREIGN KEY ("tagSlug") REFERENCES "Tag"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChannels" ADD CONSTRAINT "UserChannels_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChannels" ADD CONSTRAINT "UserChannels_channelSlug_fkey" FOREIGN KEY ("channelSlug") REFERENCES "Channel"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSkills" ADD CONSTRAINT "UserSkills_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSkills" ADD CONSTRAINT "UserSkills_skillSlug_fkey" FOREIGN KEY ("skillSlug") REFERENCES "Skill"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserIndustry" ADD CONSTRAINT "UserIndustry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserIndustry" ADD CONSTRAINT "UserIndustry_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "Industry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
