import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CompanyRevenueService } from './company-revenue.service';
import { CreateCompanyRevenueDto } from './dto/create-company-revenue.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { QueryMetadataDto } from 'src/utils';

@ApiTags('Company Revenue')
@ApiBearerAuth()
@Controller('company-revenue')
export class CompanyRevenueController {
  constructor(private readonly companyRevenueService: CompanyRevenueService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all company revenue data with filtering and pagination',
    operationId: 'getAllCompanyRevenues',
  })
  @ApiResponse({
    status: 200,
    description: 'Return a paginated list of company revenue records',
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
    description: 'Search term for numeric fields',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Sort field and direction (e.g., year:asc, total:desc)',
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    type: Object,
    description: 'Filter criteria (e.g., year)',
  })
  async getAll(@Query() query: QueryMetadataDto) {
    return this.companyRevenueService.getAll(query);
  }

  @Get('company/:companyId')
  @ApiOperation({
    summary:
      'Get revenue data for a specific company with filtering and pagination',
    operationId: 'getCompanyRevenuesByCompanyId',
  })
  @ApiParam({ name: 'companyId', description: 'The ID of the company' })
  @ApiResponse({
    status: 200,
    description: 'Return revenue data for the specified company',
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
    description: 'Search term for numeric fields',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Sort field and direction (e.g., year:asc, total:desc)',
  })
  async getByCompanyId(
    @Param('companyId') companyId: string,
    @Query() query: QueryMetadataDto,
  ) {
    return this.companyRevenueService.getByCompanyId(companyId, query);
  }

  @Post()
  @ApiOperation({
    summary: 'Create or update company revenue data',
    operationId: 'createCompanyRevenue',
  })
  @ApiBody({ type: CreateCompanyRevenueDto })
  @ApiResponse({
    status: 201,
    description:
      'The company revenue record has been successfully created or updated',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async create(@Body() data: CreateCompanyRevenueDto) {
    return this.companyRevenueService.create(data);
  }
}
