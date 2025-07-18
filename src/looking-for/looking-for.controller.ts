import {
  Controller,
  Body,
  Get,
  Post,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { LookingForService } from './looking-for.service';
import {
  CreateLookingForDto,
  UpdateLookingForDto,
} from './dto/looking-for.dto';
import { LookingFor } from '../../generated/prisma/index';
import { Public } from 'src/auth/decorators/public.decorator';
import {
  LookingForResponse,
  CreateLookingForResponse,
  UpdateLookingForResponse,
  DeleteLookingForResponse,
} from './dto/looking-for-api-response.dto';

@ApiTags('looking-for')
@Controller('looking-for')
export class LookingForController {
  constructor(private readonly lookingForService: LookingForService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new looking for category' })
  @ApiBody({ type: CreateLookingForDto })
  @ApiResponse({
    status: 201,
    description: 'Looking for category created successfully',
    schema: {
      allOf: [{ $ref: '#/components/schemas/LookingFor' }],
    },
  })
  async create(@Body() data: CreateLookingForDto): Promise<LookingFor> {
    return this.lookingForService.create(data);
  }

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Get all looking for categories with pagination and filtering',
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    description: 'Number of items to skip',
    example: 0,
  })
  @ApiQuery({
    name: 'take',
    required: false,
    description: 'Number of items to take',
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search term to filter by name',
    example: 'web',
  })
  @ApiQuery({
    name: 'industrySlug',
    required: false,
    description: 'Industry slug to filter by',
    example: 'technology',
  })
  @ApiResponse({
    status: 200,
    description: 'List of looking for categories retrieved successfully',
    schema: {
      type: 'array',
      items: { $ref: '#/components/schemas/LookingFor' },
    },
  })
  async findAll(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('search') search?: string,
    @Query('industrySlug') industrySlug?: string,
  ): Promise<LookingFor[]> {
    const where: any = {};
    if (search) where.name = { contains: search, mode: 'insensitive' };
    if (industrySlug) where.industrySlug = industrySlug;
    return this.lookingForService.findAll({ skip, take, where });
  }

  @Get('all')
  @Public()
  @ApiOperation({
    summary: 'Get all looking for categories without pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'All looking for categories retrieved successfully',
    schema: {
      type: 'array',
      items: { $ref: '#/components/schemas/LookingFor' },
    },
  })
  async findAllNoPaginate(): Promise<LookingFor[]> {
    return this.lookingForService.findAll({});
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a looking for category by ID' })
  @ApiParam({
    name: 'id',
    description: 'Looking for category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Looking for category retrieved successfully',
    schema: { $ref: '#/components/schemas/LookingFor' },
  })
  @ApiResponse({
    status: 404,
    description: 'Looking for category not found',
  })
  async findOne(@Param('id') id: string): Promise<LookingFor | null> {
    return this.lookingForService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a looking for category' })
  @ApiParam({
    name: 'id',
    description: 'Looking for category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateLookingForDto })
  @ApiResponse({
    status: 200,
    description: 'Looking for category updated successfully',
    schema: { $ref: '#/components/schemas/LookingFor' },
  })
  @ApiResponse({
    status: 404,
    description: 'Looking for category not found',
  })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateLookingForDto,
  ): Promise<LookingFor> {
    return this.lookingForService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a looking for category' })
  @ApiParam({
    name: 'id',
    description: 'Looking for category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Looking for category deleted successfully',
    schema: { $ref: '#/components/schemas/LookingFor' },
  })
  @ApiResponse({
    status: 404,
    description: 'Looking for category not found',
  })
  async remove(@Param('id') id: string): Promise<LookingFor> {
    return this.lookingForService.delete(id);
  }
}
