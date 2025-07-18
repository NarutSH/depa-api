import { Prisma } from 'generated/prisma';

/**
 * Parameters for findAll method
 */
export interface FindAllParams {
  skip?: number;
  take?: number;
  where?: Prisma.LookingForWhereInput;
  orderBy?: Prisma.LookingForOrderByWithRelationInput;
}
