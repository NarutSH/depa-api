import slugify from 'slugify';
import { PrismaClient, Prisma } from '@prisma/client';

async function generateUniqueSlug(
  model: Prisma.ModelName,
  name: string,
): Promise<string> {
  const prisma = new PrismaClient();
  let slug = slugify(name, { lower: true });
  let isUnique = false;
  let suffix = 1;

  while (!isUnique) {
    const existingRecord = await prisma[model].findUnique({
      where: { slug: slug },
    });

    if (!existingRecord) {
      isUnique = true;
    } else {
      slug = `${slugify(name, { lower: true })}-${suffix}`;
      suffix++;
    }
  }

  await prisma.$disconnect();
  return slug;
}

export { generateUniqueSlug };
