import { Controller, Get, Query, Injectable } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryMetadataDto, ResponseMetadata } from '../index';
import { QueryUtilsService } from '../services/query-utils.service';

/**
 * This is an example controller that demonstrates how to use the query metadata
 * utilities in a real NestJS controller. This file is for reference only.
 */
@ApiTags('Example')
@Controller('example')
@Injectable()
export class ExampleController {
  constructor(
    private prisma: PrismaService,
    private queryUtils: QueryUtilsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get items with pagination, filtering, sorting, and search',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved items',
    type: ResponseMetadata,
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'filter', required: false, type: String })
  async getItems(@Query() query: QueryMetadataDto) {
    // Define which fields to search in when a search term is provided
    const searchableFields = ['name', 'description', 'tags'];

    // Build the where clause for filtering and searching
    const where = this.queryUtils.buildWhereClause(query, searchableFields);

    // Build the orderBy clause for sorting
    const orderBy = this.queryUtils.buildOrderByClause(query);

    // Execute the query with pagination
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy,
        skip: query.getSkip(),
        take: query.limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    // Return the paginated response with metadata
    return ResponseMetadata.paginated(
      data,
      total,
      query.page,
      query.limit,
      'Items retrieved successfully',
    );
  }
}
