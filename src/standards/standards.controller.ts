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
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { QueryMetadataDto } from 'src/utils';
import { CreateStandardDto, UpdateStandardDto } from './dto/standard.dto';
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
    summary: 'Get all standards',
    description:
      'Retrieves all standards with pagination, filtering and sorting',
    operationId: 'getStandards',
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

  @Get('all')
  @Public()
  @ApiOperation({
    summary: 'Get all standards (no pagination)',
    operationId: 'getAllStandards',
  })
  @ApiResponse({
    status: 200,
    description: 'All standards retrieved successfully',
  })
  async getAllStandards() {
    return this.standardsService.getAllStandards();
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new standard with optional image',
    operationId: 'createStandard',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Standard creation data with optional image',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        type: { type: 'string' },
        industrySlug: { type: 'string' },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Optional image file',
        },
      },
      required: ['name'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Standard created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @UseInterceptors(FileInterceptor('image'))
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
      imagePath = uploadResult.data.path;
    }
    return this.standardsService.createStandard({
      ...createStandardDto,
      image: imagePath,
    });
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a standard with optional image',
    operationId: 'updateStandard',
  })
  @ApiParam({ name: 'id', description: 'Standard ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Standard update data with optional image',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        type: { type: 'string' },
        industrySlug: { type: 'string' },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Optional image file',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Standard updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Standard not found',
  })
  @UseInterceptors(FileInterceptor('image'))
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
      imagePath = uploadResult.data.path;
    }
    return this.standardsService.updateStandard(id, {
      ...updateStandardDto,
      image: imagePath,
    });
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a standard by ID',
    operationId: 'deleteStandard',
  })
  @ApiParam({ name: 'id', description: 'Standard ID' })
  @ApiResponse({
    status: 200,
    description: 'Standard deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Standard not found',
  })
  async deleteStandard(@Param('id') id: string) {
    return this.standardsService.deleteStandard(id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a standard by ID',
    operationId: 'getStandardById',
  })
  @ApiParam({ name: 'id', description: 'Standard ID' })
  @ApiResponse({
    status: 200,
    description: 'Standard retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Standard not found',
  })
  async getStandard(@Param('id') id: string) {
    return this.standardsService.getStandard(id);
  }
}
