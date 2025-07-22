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
  @ApiOperation({ summary: 'Get all standards (no pagination)' })
  @ApiResponse({
    status: 200,
    description: 'All standards retrieved successfully',
  })
  async getAllStandards() {
    return this.standardsService.getAllStandards();
  }

  @Post()
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
  async deleteStandard(@Param('id') id: string) {
    return this.standardsService.deleteStandard(id);
  }

  @Get(':id')
  async getStandard(@Param('id') id: string) {
    return this.standardsService.getStandard(id);
  }
}
