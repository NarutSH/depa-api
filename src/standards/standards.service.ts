import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryMetadataDto, ResponseMetadata } from 'src/utils';
import { QueryUtilsService } from 'src/utils/services/query-utils.service';
import { CreateStandardDto, UpdateStandardDto } from './dto/standard.dto';
import { StandardResponseDto } from './dto/standard-response.dto';

@Injectable()
export class StandardsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly queryUtils: QueryUtilsService,
  ) {}

  async getStandards(
    queryDto: QueryMetadataDto,
  ): Promise<ResponseMetadata<StandardResponseDto[]>> {
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

  async createStandard(
    data: CreateStandardDto,
  ): Promise<ResponseMetadata<StandardResponseDto>> {
    const standard = await this.prismaService.standards.create({
      data,
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
    });
    return ResponseMetadata.success(
      standard,
      undefined,
      'Standard created successfully',
    );
  }

  async updateStandard(
    id: string,
    data: UpdateStandardDto,
  ): Promise<ResponseMetadata<StandardResponseDto>> {
    const standard = await this.prismaService.standards.update({
      where: { id },
      data,
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
    });
    return ResponseMetadata.success(
      standard,
      undefined,
      'Standard updated successfully',
    );
  }

  async deleteStandard(id: string): Promise<ResponseMetadata<null>> {
    await this.prismaService.standards.delete({ where: { id } });
    return ResponseMetadata.success(
      null,
      undefined,
      'Standard deleted successfully',
    );
  }

  async getStandard(
    id: string,
  ): Promise<ResponseMetadata<StandardResponseDto>> {
    const standard = await this.prismaService.standards.findUnique({
      where: { id },
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
    });
    return ResponseMetadata.success(
      standard,
      undefined,
      'Standard retrieved successfully',
    );
  }

  async getAllStandards(): Promise<StandardResponseDto[]> {
    const standards = await this.prismaService.standards.findMany({
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
      orderBy: { createdAt: 'desc' },
    });
    return standards;
  }
}
