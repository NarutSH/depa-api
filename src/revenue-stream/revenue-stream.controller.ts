import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { RevenueStreamService } from './revenue-stream.service';
import { CreateRevenueStreamDto } from './dto/create-revenue-stream.dto';
import { UpdateRevenueStreamDto } from './dto/update-revenue-stream.dto';
import { UpdateRevenueValueDto } from './dto/update-revenue-value.dto';
import { QueryMetadataDto } from 'src/utils/dtos/query-metadata.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Revenue Stream')
@ApiBearerAuth()
@Controller('revenue-stream')
export class RevenueStreamController {
  constructor(private readonly revenueStreamService: RevenueStreamService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all revenue stream data with filtering and pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'Return a paginated list of revenue stream records',
    schema: {
      example: {
        data: [
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            year: 2025,
            industryTypeSlug: 'game',
            categorySlug: 'mobile-game',
            sourceSlug: 'direct-sale',
            channelSlug: 'app-store',
            segmentSlug: 'casual',
            percent: 25.5,
            ctrPercent: 15.75,
            value: 1250000.0,
            companyJuristicId: '1234567890123',
            createdAt: '2025-05-11T08:21:18.000Z',
            updatedAt: '2025-05-11T08:21:18.000Z',
            industry: {
              name: 'Game',
              slug: 'game',
            },
            category: {
              name: 'Mobile Game',
              slug: 'mobile-game',
            },
            source: {
              name: 'Direct Sale',
              slug: 'direct-sale',
            },
            channel: {
              name: 'App Store',
              slug: 'app-store',
            },
            segment: {
              name: 'Casual',
              slug: 'casual',
            },
            company: {
              id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
              juristicId: '1234567890123',
              nameTh: 'บริษัท ทดสอบ จำกัด',
              nameEn: 'Test Company Ltd.',
            },
          },
        ],
        meta: {
          total: 25,
          page: 1,
          limit: 10,
          totalPages: 3,
        },
      },
    },
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
    description: 'Search term for revenue stream fields',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Sort field and direction (e.g., year:asc, value:desc)',
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    type: Object,
    description: 'Filter criteria (e.g., year, industryTypeSlug)',
  })
  async getAll(@Query() query: QueryMetadataDto) {
    return this.revenueStreamService.getAll(query);
  }

  @Get('company/:companyJuristicId')
  @ApiOperation({ summary: 'Get revenue stream data for a specific company' })
  @ApiParam({
    name: 'companyJuristicId',
    description: 'The juristic ID of the company',
  })
  @ApiResponse({
    status: 200,
    description: 'Return revenue stream data for the specified company',
    schema: {
      example: {
        data: [
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            year: 2025,
            industryTypeSlug: 'game',
            categorySlug: 'mobile-game',
            sourceSlug: 'direct-sale',
            channelSlug: 'app-store',
            segmentSlug: 'casual',
            percent: 25.5,
            ctrPercent: 15.75,
            value: 1250000.0,
            companyJuristicId: '1234567890123',
            createdAt: '2025-05-11T08:21:18.000Z',
            updatedAt: '2025-05-11T08:21:18.000Z',
            industry: {
              name: 'Game',
              slug: 'game',
            },
            category: {
              name: 'Mobile Game',
              slug: 'mobile-game',
            },
            source: {
              name: 'Direct Sale',
              slug: 'direct-sale',
            },
            channel: {
              name: 'App Store',
              slug: 'app-store',
            },
            segment: {
              name: 'Casual',
              slug: 'casual',
            },
          },
        ],
        meta: {
          total: 5,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      },
    },
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
    description: 'Search term for revenue stream fields',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Sort field and direction (e.g., year:asc, value:desc)',
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    type: Object,
    description: 'Filter criteria (e.g., year, industryTypeSlug)',
  })
  async getByCompanyId(
    @Param('companyJuristicId') companyJuristicId: string,
    @Query() query: QueryMetadataDto,
  ) {
    return this.revenueStreamService.getByCompanyId(companyJuristicId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific revenue stream record by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the revenue stream record' })
  @ApiResponse({
    status: 200,
    description: 'Return the specified revenue stream record',
    schema: {
      example: {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        year: 2025,
        industryTypeSlug: 'game',
        categorySlug: 'mobile-game',
        sourceSlug: 'direct-sale',
        channelSlug: 'app-store',
        segmentSlug: 'casual',
        percent: 25.5,
        ctrPercent: 15.75,
        value: 1250000.0,
        companyJuristicId: '1234567890123',
        createdAt: '2025-05-11T08:21:18.000Z',
        updatedAt: '2025-05-11T08:21:18.000Z',
        industry: {
          id: 'b1c2d3e4-f5a6-7890-abcd-ef1234567890',
          name: 'Game',
          slug: 'game',
          createdAt: '2025-05-07T08:11:04.000Z',
          updatedAt: '2025-05-07T08:11:04.000Z',
        },
        category: {
          id: 'c1d2e3f4-a5b6-7890-abcd-ef1234567890',
          name: 'Mobile Game',
          slug: 'mobile-game',
          createdAt: '2025-05-07T08:11:04.000Z',
          updatedAt: '2025-05-07T08:11:04.000Z',
          industrySlug: 'game',
        },
        source: {
          id: 'd1e2f3a4-b5c6-7890-abcd-ef1234567890',
          name: 'Direct Sale',
          slug: 'direct-sale',
          createdAt: '2025-05-07T08:11:04.000Z',
          updatedAt: '2025-05-07T08:11:04.000Z',
          industrySlug: 'game',
        },
        channel: {
          id: 'e1f2a3b4-c5d6-7890-abcd-ef1234567890',
          name: 'App Store',
          slug: 'app-store',
          createdAt: '2025-05-07T08:11:04.000Z',
          updatedAt: '2025-05-07T08:11:04.000Z',
          industrySlug: 'game',
        },
        segment: {
          id: 'f1a2b3c4-d5e6-7890-abcd-ef1234567890',
          name: 'Casual',
          slug: 'casual',
          createdAt: '2025-05-07T08:11:04.000Z',
          updatedAt: '2025-05-07T08:11:04.000Z',
          industrySlug: 'game',
        },
        company: {
          id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          juristicId: '1234567890123',
          nameTh: 'บริษัท ทดสอบ จำกัด',
          nameEn: 'Test Company Ltd.',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Revenue stream record not found',
    schema: {
      example: {
        statusCode: 404,
        message:
          'Revenue stream with ID a1b2c3d4-e5f6-7890-abcd-ef1234567890 not found',
        error: 'Not Found',
      },
    },
  })
  async getById(@Param('id') id: string) {
    return this.revenueStreamService.getById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new revenue stream record' })
  @ApiBody({
    type: CreateRevenueStreamDto,
    examples: {
      example1: {
        summary: 'Basic revenue stream creation',
        description: 'Example payload for creating a new revenue stream',
        value: {
          year: 2025,
          industryTypeSlug: 'game',
          categorySlug: 'mobile-game',
          sourceSlug: 'direct-sale',
          channelSlug: 'app-store',
          segmentSlug: 'casual',
          percent: 25.5,
          ctrPercent: 15.75,
          value: 1250000.0,
          companyJuristicId: '1234567890123',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The revenue stream record has been successfully created',
    schema: {
      example: {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        year: 2025,
        industryTypeSlug: 'game',
        categorySlug: 'mobile-game',
        sourceSlug: 'direct-sale',
        channelSlug: 'app-store',
        segmentSlug: 'casual',
        percent: 25.5,
        ctrPercent: 15.75,
        value: 1250000.0,
        companyJuristicId: '1234567890123',
        createdAt: '2025-05-11T08:21:18.000Z',
        updatedAt: '2025-05-11T08:21:18.000Z',
        industry: {
          name: 'Game',
          slug: 'game',
        },
        category: {
          name: 'Mobile Game',
          slug: 'mobile-game',
        },
        source: {
          name: 'Direct Sale',
          slug: 'direct-sale',
        },
        channel: {
          name: 'App Store',
          slug: 'app-store',
        },
        segment: {
          name: 'Casual',
          slug: 'casual',
        },
      },
    },
  })
  async create(@Body() data: CreateRevenueStreamDto) {
    return this.revenueStreamService.create(data);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Create multiple revenue stream records' })
  @ApiBody({
    type: [CreateRevenueStreamDto],
    examples: {
      example1: {
        summary: 'Bulk revenue stream creation',
        description: 'Example payload for creating multiple revenue streams',
        value: [
          {
            year: 2025,
            industryTypeSlug: 'game',
            categorySlug: 'mobile-game',
            sourceSlug: 'direct-sale',
            channelSlug: 'app-store',
            segmentSlug: 'casual',
            percent: 25.5,
            ctrPercent: 15.75,
            value: 1250000.0,
            companyJuristicId: '1234567890123',
          },
          {
            year: 2025,
            industryTypeSlug: 'game',
            categorySlug: 'console-game',
            sourceSlug: 'direct-sale',
            channelSlug: 'playstation-store',
            segmentSlug: 'action',
            percent: 35.0,
            ctrPercent: 22.5,
            value: 1750000.0,
            companyJuristicId: '1234567890123',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The revenue stream records have been successfully created',
    schema: {
      example: [
        {
          id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          year: 2025,
          industryTypeSlug: 'game',
          categorySlug: 'mobile-game',
          sourceSlug: 'direct-sale',
          channelSlug: 'app-store',
          segmentSlug: 'casual',
          percent: 25.5,
          ctrPercent: 15.75,
          value: 1250000.0,
          companyJuristicId: '1234567890123',
          createdAt: '2025-05-11T08:21:18.000Z',
          updatedAt: '2025-05-11T08:21:18.000Z',
          industry: {
            name: 'Game',
            slug: 'game',
          },
          category: {
            name: 'Mobile Game',
            slug: 'mobile-game',
          },
          source: {
            name: 'Direct Sale',
            slug: 'direct-sale',
          },
          channel: {
            name: 'App Store',
            slug: 'app-store',
          },
          segment: {
            name: 'Casual',
            slug: 'casual',
          },
        },
        {
          id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
          year: 2025,
          industryTypeSlug: 'game',
          categorySlug: 'console-game',
          sourceSlug: 'direct-sale',
          channelSlug: 'playstation-store',
          segmentSlug: 'action',
          percent: 35.0,
          ctrPercent: 22.5,
          value: 1750000.0,
          companyJuristicId: '1234567890123',
          createdAt: '2025-05-11T08:21:18.000Z',
          updatedAt: '2025-05-11T08:21:18.000Z',
          industry: {
            name: 'Game',
            slug: 'game',
          },
          category: {
            name: 'Console Game',
            slug: 'console-game',
          },
          source: {
            name: 'Direct Sale',
            slug: 'direct-sale',
          },
          channel: {
            name: 'PlayStation Store',
            slug: 'playstation-store',
          },
          segment: {
            name: 'Action',
            slug: 'action',
          },
        },
      ],
    },
  })
  async createMany(@Body() data: CreateRevenueStreamDto[]) {
    return this.revenueStreamService.createMany(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a revenue stream record' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the revenue stream record to update',
  })
  @ApiBody({
    type: UpdateRevenueStreamDto,
    examples: {
      example1: {
        summary: 'Update revenue stream',
        description: 'Example payload for updating a revenue stream record',
        value: {
          value: 1500000.0,
          percent: 30.0,
          ctrPercent: 18.5,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The revenue stream record has been successfully updated',
    schema: {
      example: {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        year: 2025,
        industryTypeSlug: 'game',
        categorySlug: 'mobile-game',
        sourceSlug: 'direct-sale',
        channelSlug: 'app-store',
        segmentSlug: 'casual',
        percent: 30.0,
        ctrPercent: 18.5,
        value: 1500000.0,
        companyJuristicId: '1234567890123',
        createdAt: '2025-05-11T08:21:18.000Z',
        updatedAt: '2025-05-12T10:15:22.000Z',
        industry: {
          name: 'Game',
          slug: 'game',
        },
        category: {
          name: 'Mobile Game',
          slug: 'mobile-game',
        },
        source: {
          name: 'Direct Sale',
          slug: 'direct-sale',
        },
        channel: {
          name: 'App Store',
          slug: 'app-store',
        },
        segment: {
          name: 'Casual',
          slug: 'casual',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Revenue stream record not found',
    schema: {
      example: {
        statusCode: 404,
        message:
          'Revenue stream with ID a1b2c3d4-e5f6-7890-abcd-ef1234567890 not found',
        error: 'Not Found',
      },
    },
  })
  async update(@Param('id') id: string, @Body() data: UpdateRevenueStreamDto) {
    return this.revenueStreamService.update(id, data);
  }

  @Patch(':id/value')
  @ApiOperation({ summary: 'Update just the value of a revenue stream record' })
  @ApiParam({ name: 'id', description: 'The ID of the revenue stream record' })
  @ApiBody({
    type: UpdateRevenueValueDto,
    examples: {
      example1: {
        summary: 'Update revenue value',
        description: 'Example payload for updating just the value field',
        value: {
          value: 1500000.0,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The value has been successfully updated',
    schema: {
      example: {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        year: 2025,
        industryTypeSlug: 'game',
        categorySlug: 'mobile-game',
        sourceSlug: 'direct-sale',
        channelSlug: 'app-store',
        segmentSlug: 'casual',
        percent: 25.5,
        ctrPercent: 15.75,
        value: 1500000.0,
        companyJuristicId: '1234567890123',
        createdAt: '2025-05-11T08:21:18.000Z',
        updatedAt: '2025-05-12T10:15:22.000Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Revenue stream record not found',
    schema: {
      example: {
        statusCode: 404,
        message:
          'Revenue stream with ID a1b2c3d4-e5f6-7890-abcd-ef1234567890 not found',
        error: 'Not Found',
      },
    },
  })
  async updateValue(
    @Param('id') id: string,
    @Body() data: UpdateRevenueValueDto,
  ) {
    return this.revenueStreamService.updateValue(id, { value: data.value });
  }

  @Post('bulk-values')
  @ApiOperation({ summary: 'Bulk update or create revenue stream values' })
  @ApiBody({
    type: [UpdateRevenueValueDto],
    examples: {
      example1: {
        summary: 'Bulk update revenue values',
        description: 'Example payload for updating multiple revenue values',
        value: [
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            value: 1500000.0,
          },
          {
            // Create a new record if ID is not provided but all required fields are
            companyJuristicId: '1234567890123',
            year: 2025,
            industryTypeSlug: 'game',
            categorySlug: 'pc-game',
            sourceSlug: 'direct-sale',
            channelSlug: 'steam',
            segmentSlug: 'rpg',
            percent: 40.0,
            ctrPercent: 25.0,
            value: 2000000.0,
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The values have been successfully updated or created',
    schema: {
      example: [
        {
          id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          year: 2025,
          industryTypeSlug: 'game',
          categorySlug: 'mobile-game',
          sourceSlug: 'direct-sale',
          channelSlug: 'app-store',
          segmentSlug: 'casual',
          percent: 25.5,
          ctrPercent: 15.75,
          value: 1500000.0,
          companyJuristicId: '1234567890123',
          createdAt: '2025-05-11T08:21:18.000Z',
          updatedAt: '2025-05-12T10:15:22.000Z',
        },
        {
          id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
          year: 2025,
          industryTypeSlug: 'game',
          categorySlug: 'pc-game',
          sourceSlug: 'direct-sale',
          channelSlug: 'steam',
          segmentSlug: 'rpg',
          percent: 40.0,
          ctrPercent: 25.0,
          value: 2000000.0,
          companyJuristicId: '1234567890123',
          createdAt: '2025-05-12T10:15:22.000Z',
          updatedAt: '2025-05-12T10:15:22.000Z',
        },
      ],
    },
  })
  async bulkUpsertValues(@Body() data: UpdateRevenueValueDto[]) {
    return this.revenueStreamService.bulkUpsertValues(data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a revenue stream record' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the revenue stream record to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'The revenue stream record has been successfully deleted',
    schema: {
      example: {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        year: 2025,
        industryTypeSlug: 'game',
        categorySlug: 'mobile-game',
        sourceSlug: 'direct-sale',
        channelSlug: 'app-store',
        segmentSlug: 'casual',
        percent: 25.5,
        ctrPercent: 15.75,
        value: 1250000.0,
        companyJuristicId: '1234567890123',
        createdAt: '2025-05-11T08:21:18.000Z',
        updatedAt: '2025-05-11T08:21:18.000Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Revenue stream record not found',
    schema: {
      example: {
        statusCode: 404,
        message:
          'Revenue stream with ID a1b2c3d4-e5f6-7890-abcd-ef1234567890 not found',
        error: 'Not Found',
      },
    },
  })
  async delete(@Param('id') id: string) {
    return this.revenueStreamService.delete(id);
  }
}
