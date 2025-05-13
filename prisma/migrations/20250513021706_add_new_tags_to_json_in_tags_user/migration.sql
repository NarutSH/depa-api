-- AlterTable
ALTER TABLE "User" ADD COLUMN     "channels_json" JSONB,
ADD COLUMN     "specialists_json" JSONB,
ADD COLUMN     "tags_json" JSONB;
