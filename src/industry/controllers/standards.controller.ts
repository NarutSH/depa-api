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
import { CreateStandardsDto } from '../dto/create-standards.dto';
import { UpdateStandardsDto } from '../dto/update-standards.dto';
import { FindStandardsDto } from '../dto/find-standards.dto';
import { StandardsResponseDto } from '../dto/standards-response.dto';

@ApiTags('Standards')
@Controller('industry/standards')
export class StandardsController {
  constructor(private readonly industryService: IndustryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new standards' })
  @ApiResponse({
    status: 201,
    description: 'The standards has been successfully created.',
    type: StandardsResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 409, description: 'Standards already exists.' })
  async create(
    @Body() createStandardsDto: CreateStandardsDto,
  ): Promise<StandardsResponseDto> {
    return this.industryService.createStandards(createStandardsDto);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all standards' })
  @ApiResponse({
    status: 200,
    description: 'Return all standards.',
    type: [StandardsResponseDto],
  })
  async findAll(
    @Query() findStandardsDto: FindStandardsDto,
  ): Promise<StandardsResponseDto[]> {
    return this.industryService.findAllStandards(findStandardsDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a standards by ID' })
  @ApiParam({ name: 'id', description: 'Standards ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the standards.',
    type: StandardsResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Standards not found.' })
  async findOne(@Param('id') id: string): Promise<StandardsResponseDto> {
    return this.industryService.findOneStandards(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a standards' })
  @ApiParam({ name: 'id', description: 'Standards ID' })
  @ApiResponse({
    status: 200,
    description: 'The standards has been successfully updated.',
    type: StandardsResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Standards not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateStandardsDto: UpdateStandardsDto,
  ): Promise<StandardsResponseDto> {
    return this.industryService.updateStandards(id, updateStandardsDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a standards' })
  @ApiParam({ name: 'id', description: 'Standards ID' })
  @ApiResponse({
    status: 200,
    description: 'The standards has been successfully deleted.',
    type: StandardsResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Standards not found.' })
  async remove(@Param('id') id: string): Promise<StandardsResponseDto> {
    return this.industryService.removeStandards(id);
  }
}
