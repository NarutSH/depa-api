-- AlterTable
ALTER TABLE "User" ADD COLUMN     "channels" JSONB[] DEFAULT ARRAY[]::JSONB[],
ADD COLUMN     "industries" TEXT[],
ADD COLUMN     "specialists" JSONB[] DEFAULT ARRAY[]::JSONB[],
ADD COLUMN     "tags" JSONB[] DEFAULT ARRAY[]::JSONB[];
