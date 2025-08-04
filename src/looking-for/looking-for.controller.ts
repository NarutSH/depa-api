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
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LookingForService } from './looking-for.service';
import {
  CreateLookingForDto,
  UpdateLookingForDto,
} from './dto/looking-for.dto';
import { LookingFor } from '../../generated/prisma/index';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('Looking For')
@Controller('looking-for')
export class LookingForController {
  constructor(private readonly lookingForService: LookingForService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new looking for item',
    operationId: 'createLookingFor',
  })
  @ApiBody({ type: CreateLookingForDto })
  @ApiResponse({
    status: 201,
    description: 'Looking for item created successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() data: CreateLookingForDto): Promise<LookingFor> {
    return this.lookingForService.create(data);
  }

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Get looking for items with filtering and pagination',
    operationId: 'getLookingForItems',
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    type: Number,
    description: 'Number of items to skip',
  })
  @ApiQuery({
    name: 'take',
    required: false,
    type: Number,
    description: 'Number of items to take',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term for name',
  })
  @ApiQuery({
    name: 'industrySlug',
    required: false,
    type: String,
    description: 'Filter by industry slug',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved looking for items',
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
    summary: 'Get all looking for items without pagination',
    operationId: 'getAllLookingForItems',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all looking for items',
  })
  async findAllNoPaginate(): Promise<LookingFor[]> {
    return this.lookingForService.findAll({});
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get looking for item by ID',
    operationId: 'getLookingForItemById',
  })
  @ApiParam({ name: 'id', description: 'Looking for item ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved looking for item',
  })
  @ApiResponse({ status: 404, description: 'Looking for item not found' })
  async findOne(@Param('id') id: string): Promise<LookingFor | null> {
    return this.lookingForService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update looking for item by ID',
    operationId: 'updateLookingFor',
  })
  @ApiParam({ name: 'id', description: 'Looking for item ID' })
  @ApiBody({ type: UpdateLookingForDto })
  @ApiResponse({
    status: 200,
    description: 'Looking for item updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Looking for item not found' })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateLookingForDto,
  ): Promise<LookingFor> {
    return this.lookingForService.update(id, data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete looking for item by ID',
    operationId: 'deleteLookingFor',
  })
  @ApiParam({ name: 'id', description: 'Looking for item ID' })
  @ApiResponse({
    status: 200,
    description: 'Looking for item deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Looking for item not found' })
  async remove(@Param('id') id: string): Promise<LookingFor> {
    return this.lookingForService.delete(id);
  }
}
