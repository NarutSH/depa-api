import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { IndustryService } from '../industry.service';
import { CreateLookingForDto } from '../dto/create-looking-for.dto';
import { UpdateLookingForDto } from '../dto/update-looking-for.dto';
import { FindLookingForDto } from '../dto/find-looking-for.dto';
import { LookingForResponseDto } from '../dto/looking-for-response.dto';

@ApiTags('Looking For')
@Controller('industry/looking-for')
export class LookingForController {
  constructor(private readonly industryService: IndustryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new looking for' })
  @ApiResponse({
    status: 201,
    description: 'The looking for has been successfully created.',
    type: LookingForResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 409, description: 'Looking for already exists.' })
  async create(
    @Body() createLookingForDto: CreateLookingForDto,
  ): Promise<LookingForResponseDto> {
    return this.industryService.createLookingFor(createLookingForDto);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all looking for items' })
  @ApiResponse({
    status: 200,
    description: 'Return all looking for items.',
    type: [LookingForResponseDto],
  })
  async findAll(
    @Query() findLookingForDto: FindLookingForDto,
  ): Promise<LookingForResponseDto[]> {
    return this.industryService.findAllLookingFor(findLookingForDto);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a looking for by slug' })
  @ApiParam({ name: 'slug', description: 'Looking for slug' })
  @ApiResponse({
    status: 200,
    description: 'Return the looking for.',
    type: LookingForResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Looking for not found.' })
  async findOne(@Param('slug') slug: string): Promise<LookingForResponseDto> {
    return this.industryService.findOneLookingFor(slug);
  }

  @Put(':slug')
  @ApiOperation({ summary: 'Update a looking for' })
  @ApiParam({ name: 'slug', description: 'Looking for slug' })
  @ApiResponse({
    status: 200,
    description: 'The looking for has been successfully updated.',
    type: LookingForResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Looking for not found.' })
  @ApiResponse({ status: 409, description: 'Looking for slug already exists.' })
  async update(
    @Param('slug') slug: string,
    @Body() updateLookingForDto: UpdateLookingForDto,
  ): Promise<LookingForResponseDto> {
    return this.industryService.updateLookingFor(slug, updateLookingForDto);
  }

  @Delete(':slug')
  @ApiOperation({ summary: 'Delete a looking for' })
  @ApiParam({ name: 'slug', description: 'Looking for slug' })
  @ApiResponse({
    status: 200,
    description: 'The looking for has been successfully deleted.',
    type: LookingForResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Looking for not found.' })
  async remove(@Param('slug') slug: string): Promise<LookingForResponseDto> {
    return this.industryService.removeLookingFor(slug);
  }
}
