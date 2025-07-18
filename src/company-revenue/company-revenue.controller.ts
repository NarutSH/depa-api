import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CompanyRevenueService } from './company-revenue.service';
import { CreateCompanyRevenueDto } from './dto/create-company-revenue.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { QueryMetadataDto } from 'src/utils';
import {
  GetCompanyRevenuesResponse,
  GetCompanyRevenuesByCompanyIdResponse,
} from './dto/company-revenue-api-response.dto';

@ApiTags('Company Revenue')
@ApiBearerAuth()
@Controller('company-revenue')
export class CompanyRevenueController {
  constructor(private readonly companyRevenueService: CompanyRevenueService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all company revenue data with filtering and pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'Return a paginated list of company revenue records',
    schema: {
      allOf: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                allOf: [
                  { $ref: '#/components/schemas/CompanyRevenue' },
                  {
                    type: 'object',
                    properties: {
                      company: {
                        type: 'object',
                        properties: {
                          juristicId: { type: 'string' },
                          nameTh: { type: 'string' },
                          nameEn: { type: 'string' },
                        },
                      },
                    },
                  },
                ],
              },
            },
            total: { type: 'number' },
            page: { type: 'number' },
            limit: { type: 'number' },
            message: { type: 'string' },
          },
        },
      ],
    },
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (1-based)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term for numeric fields',
    example: '2024',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Sort field and direction (e.g., year:asc, total:desc)',
    example: 'year:desc',
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    type: String,
    description: 'Filter criteria (e.g., year:2024)',
    example: 'year:2024',
  })
  async getAll(
    @Query() query: QueryMetadataDto,
  ): Promise<GetCompanyRevenuesResponse> {
    return this.companyRevenueService.getAll(query);
  }

  @Get('company/:companyId')
  @ApiOperation({
    summary:
      'Get revenue data for a specific company with filtering and pagination',
  })
  @ApiParam({
    name: 'companyId',
    description: 'The ID of the company',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Return revenue data for the specified company',
    schema: {
      allOf: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                allOf: [
                  { $ref: '#/components/schemas/CompanyRevenue' },
                  {
                    type: 'object',
                    properties: {
                      company: {
                        type: 'object',
                        properties: {
                          juristicId: { type: 'string' },
                          nameTh: { type: 'string' },
                          nameEn: { type: 'string' },
                        },
                      },
                    },
                  },
                ],
              },
            },
            total: { type: 'number' },
            page: { type: 'number' },
            limit: { type: 'number' },
            message: { type: 'string' },
          },
        },
      ],
    },
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (1-based)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term for numeric fields',
    example: '2024',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Sort field and direction (e.g., year:asc, total:desc)',
    example: 'year:desc',
  })
  async getByCompanyId(
    @Param('companyId') companyId: string,
    @Query() query: QueryMetadataDto,
  ): Promise<GetCompanyRevenuesByCompanyIdResponse> {
    return this.companyRevenueService.getByCompanyId(companyId, query);
  }

  @Post()
  @ApiOperation({ summary: 'Create or update company revenue data' })
  @ApiBody({
    type: CreateCompanyRevenueDto,
    description: 'Company revenue data to create or update',
  })
  @ApiResponse({
    status: 201,
    description:
      'The company revenue record has been successfully created or updated',
    schema: {
      allOf: [
        { $ref: '#/components/schemas/CompanyRevenue' },
        {
          type: 'object',
          properties: {
            company: {
              type: 'object',
              properties: {
                juristicId: { type: 'string' },
                nameTh: { type: 'string' },
                nameEn: { type: 'string' },
              },
            },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  async create(@Body() data: CreateCompanyRevenueDto): Promise<any> {
    return this.companyRevenueService.create(data);
  }
}
