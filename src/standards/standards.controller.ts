import { Controller, Get, Query } from '@nestjs/common';
import { StandardsService } from './standards.service';
import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { QueryMetadataDto } from 'src/utils';

@ApiTags('Standards')
@ApiBearerAuth()
@Controller('standards')
export class StandardsController {
  constructor(private readonly standardsService: StandardsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all standards',
    description:
      'Retrieves all standards with pagination, filtering and sorting',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all standards retrieved successfully',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (1-based)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term for name and description',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Sort field and direction (e.g., name:asc, createdAt:desc)',
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    type: Object,
    description: 'Filter criteria (e.g., type, industrySlug)',
  })
  async getStandards(@Query() query: QueryMetadataDto) {
    return this.standardsService.getStandards(query);
  }
}
