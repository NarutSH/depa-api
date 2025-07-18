import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCompanyRevenueDto } from './dto/create-company-revenue.dto';
import { QueryMetadataDto, ResponseMetadata } from 'src/utils';
import { QueryUtilsService } from 'src/utils/services/query-utils.service';
import { CompanyRevenue } from 'generated/prisma';

@Injectable()
export class CompanyRevenueService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly queryUtils: QueryUtilsService,
  ) {}

  async getAll(queryDto?: QueryMetadataDto): Promise<CompanyRevenue[] | any> {
    // If no query params provided, return all results without pagination
    if (!queryDto) {
      return this.prismaService.companyRevenue.findMany();
    }

    // Ensure we have valid pagination values
    const page = Number(queryDto.page) || 1;
    const limit = Number(queryDto.limit) || 10;
    const skip = (page - 1) * limit;

    // Define searchable fields for revenues
    const searchableFields = ['year', 'total'];

    // Build where clause for filtering and searching
    const where = this.queryUtils.buildWhereClause(queryDto, searchableFields);

    // Build orderBy clause for sorting
    const orderBy = this.queryUtils.buildOrderByClause(queryDto, {
      createdAt: 'desc',
    });

    // Execute the query with pagination
    const [companyRevenues, total] = await Promise.all([
      this.prismaService.companyRevenue.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          company: {
            select: {
              juristicId: true,
              nameTh: true,
              nameEn: true,
            },
          },
        },
      }),
      this.prismaService.companyRevenue.count({ where }),
    ]);

    // Return paginated response with metadata
    return ResponseMetadata.paginated(
      companyRevenues,
      total,
      page,
      limit,
      'Company revenue data retrieved successfully',
    );
  }

  async getByCompanyId(
    companyId: string,
    queryDto?: QueryMetadataDto,
  ): Promise<CompanyRevenue[] | any> {
    if (!queryDto) {
      return this.prismaService.companyRevenue.findMany({
        where: {
          companyId,
        },
      });
    }

    // Ensure we have valid pagination values
    const page = Number(queryDto.page) || 1;
    const limit = Number(queryDto.limit) || 10;
    const skip = (page - 1) * limit;

    // Create base where condition for this company
    const baseWhere = {
      companyId,
    };

    // Add additional search and filter conditions from query
    // Merging the base where condition with the search/filter conditions
    const whereConditions = {
      ...baseWhere,
      ...this.queryUtils.buildWhereClause(queryDto, ['year', 'total']),
    };

    // Build orderBy clause for sorting
    const orderBy = this.queryUtils.buildOrderByClause(queryDto, {
      year: 'desc',
    });

    // Execute the query with pagination
    const [companyRevenues, total] = await Promise.all([
      this.prismaService.companyRevenue.findMany({
        where: whereConditions,
        orderBy,
        skip,
        take: limit,
        include: {
          company: {
            select: {
              juristicId: true,
              nameTh: true,
              nameEn: true,
            },
          },
        },
      }),
      this.prismaService.companyRevenue.count({ where: whereConditions }),
    ]);

    // Return paginated response with metadata
    return ResponseMetadata.paginated(
      companyRevenues,
      total,
      page,
      limit,
      `Company revenue data for company ID ${companyId} retrieved successfully`,
    );
  }

  async create(data: CreateCompanyRevenueDto): Promise<CompanyRevenue> {
    return this.prismaService.companyRevenue.upsert({
      create: data,
      update: data,
      where: {
        companyId_year: {
          companyId: data.companyId,
          year: data.year,
        },
      },
    });
  }
}
