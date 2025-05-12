import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryMetadataDto, ResponseMetadata } from 'src/utils';
import { QueryUtilsService } from 'src/utils/services/query-utils.service';

@Injectable()
export class StandardsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly queryUtils: QueryUtilsService,
  ) {}

  async getStandards(queryDto: QueryMetadataDto) {
    // Ensure we have valid pagination values
    const page = Number(queryDto.page) || 1;
    const limit = Number(queryDto.limit) || 10;
    const skip = (page - 1) * limit;

    // Define searchable fields for standards
    const searchableFields = ['name', 'description'];

    // Build where clause for filtering and searching
    const where = this.queryUtils.buildWhereClause(queryDto, searchableFields);

    // Build orderBy clause for sorting
    const orderBy = this.queryUtils.buildOrderByClause(queryDto, {
      createdAt: 'desc',
    });

    // Execute the query with pagination
    const [standards, total] = await Promise.all([
      this.prismaService.standards.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          type: true,
          description: true,
          image: true,
          industrySlug: true,
          industry: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      }),
      this.prismaService.standards.count({ where }),
    ]);

    // Return paginated response with metadata
    return ResponseMetadata.paginated(
      standards,
      total,
      page,
      limit,
      'Standards retrieved successfully',
    );
  }
}
