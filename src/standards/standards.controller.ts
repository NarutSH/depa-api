import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StandardsService } from './standards.service';
import {
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { QueryMetadataDto } from 'src/utils';
import { CreateStandardDto, UpdateStandardDto } from './dto/standard.dto';
import {
  StandardResponseDto,
  StandardsListApiResponse,
  StandardApiResponse,
  StandardDeleteApiResponse,
} from './dto/standard-response.dto';
import { UploadService } from 'src/upload/upload.service';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('Standards')
@ApiBearerAuth()
@Controller('standards')
export class StandardsController {
  constructor(
    private readonly standardsService: StandardsService,
    private readonly uploadService: UploadService,
  ) {}

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Get all standards with pagination',
    description:
      'Retrieves all standards with advanced pagination, filtering, and sorting capabilities',
  })
  @ApiOkResponse({
    description: 'Standards retrieved successfully with pagination metadata',
    type: StandardsListApiResponse,
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
    description: 'Number of items per page',
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term for name and description',
    example: 'ISO 27001',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Sort field and direction (e.g., name:asc, createdAt:desc)',
    example: 'name:asc',
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    type: Object,
    description: 'Filter criteria (e.g., type, industrySlug)',
    example: { type: 'CERTIFICATION', industrySlug: 'information-technology' },
  })
  async getStandards(@Query() query: QueryMetadataDto) {
    return this.standardsService.getStandards(query);
  }

  @Get('all')
  @Public()
  @ApiOperation({
    summary: 'Get all standards without pagination',
    description: 'Retrieves all standards in the system without pagination',
  })
  @ApiOkResponse({
    description: 'All standards retrieved successfully',
    type: () => [StandardResponseDto],
  })
  async getAllStandards() {
    return this.standardsService.getAllStandards();
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({
    summary: 'Create a new standard',
    description: 'Creates a new standard with optional image upload',
  })
  @ApiCreatedResponse({
    description: 'Standard created successfully',
    type: StandardApiResponse,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Standard creation data with optional image',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Standard name',
          example: 'ISO 27001 Information Security Management',
        },
        description: {
          type: 'string',
          description: 'Standard description',
          example:
            'International standard for information security management systems',
        },
        type: {
          type: 'string',
          enum: ['CERTIFICATION', 'FRAMEWORK', 'GUIDELINE', 'METHODOLOGY'],
          description: 'Type of standard',
          example: 'CERTIFICATION',
        },
        industrySlug: {
          type: 'string',
          description: 'Industry slug',
          example: 'information-technology',
        },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Standard image file',
        },
      },
      required: ['name', 'type', 'industrySlug'],
    },
  })
  async createStandard(
    @Body() createStandardDto: CreateStandardDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    let imagePath: string | undefined = undefined;
    if (image) {
      const uploadResult = await this.uploadService.uploadFile(
        image,
        'portfolio/standards',
      );
      imagePath = uploadResult.path;
    }
    return this.standardsService.createStandard({
      ...createStandardDto,
      image: imagePath,
    });
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({
    summary: 'Update an existing standard',
    description: 'Updates a standard with optional image upload',
  })
  @ApiOkResponse({
    description: 'Standard updated successfully',
    type: StandardApiResponse,
  })
  @ApiParam({
    name: 'id',
    description: 'Standard unique identifier',
    example: 'standard-123-uuid',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Standard update data with optional image',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Updated standard name',
          example: 'ISO 27001 Information Security Management System',
        },
        description: {
          type: 'string',
          description: 'Updated standard description',
          example:
            'International standard for information security management systems with enhanced controls',
        },
        type: {
          type: 'string',
          enum: ['CERTIFICATION', 'FRAMEWORK', 'GUIDELINE', 'METHODOLOGY'],
          description: 'Updated type of standard',
          example: 'CERTIFICATION',
        },
        industrySlug: {
          type: 'string',
          description: 'Updated industry slug',
          example: 'information-technology',
        },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Updated standard image file',
        },
      },
    },
  })
  async updateStandard(
    @Param('id') id: string,
    @Body() updateStandardDto: UpdateStandardDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    let imagePath: string | undefined = undefined;
    if (image) {
      const uploadResult = await this.uploadService.uploadFile(
        image,
        'standards',
      );
      imagePath = uploadResult.path;
    }
    return this.standardsService.updateStandard(id, {
      ...updateStandardDto,
      image: imagePath,
    });
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a standard',
    description: 'Permanently deletes a standard from the system',
  })
  @ApiOkResponse({
    description: 'Standard deleted successfully',
    type: StandardDeleteApiResponse,
  })
  @ApiParam({
    name: 'id',
    description: 'Standard unique identifier',
    example: 'standard-123-uuid',
  })
  async deleteStandard(@Param('id') id: string) {
    return this.standardsService.deleteStandard(id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a standard by ID',
    description: 'Retrieves a specific standard by its unique identifier',
  })
  @ApiOkResponse({
    description: 'Standard retrieved successfully',
    type: StandardApiResponse,
  })
  @ApiParam({
    name: 'id',
    description: 'Standard unique identifier',
    example: 'standard-123-uuid',
  })
  async getStandard(@Param('id') id: string) {
    return this.standardsService.getStandard(id);
  }
}
