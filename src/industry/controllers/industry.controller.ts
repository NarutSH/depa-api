import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { IndustryService } from '../industry.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateIndustryDto } from '../dto/create-industry.dto';
import { UpdateIndustryDto } from '../dto/update-industry.dto';
import {
  IndustryResponseDto,
  IndustryWithRelationsResponseDto,
  IndustryListResponseDto,
} from '../dto/industry-response.dto';
import {
  ValidationErrorResponseDto,
  NotFoundErrorResponseDto,
  UnauthorizedErrorResponseDto,
} from 'src/utils/dtos/error-response.dto';

@ApiTags('Industry')
@ApiBearerAuth()
@Controller('industry')
export class IndustryController {
  constructor(private readonly industryService: IndustryService) {}

  // Industry CRUD endpoints

  @ApiOperation({
    summary: 'Create a new industry',
    operationId: 'createIndustry',
  })
  @ApiBody({
    type: CreateIndustryDto,
    description: 'Industry data to create',
    required: true,
  })
  @ApiCreatedResponse({
    description: 'Industry has been successfully created',
    type: IndustryResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ValidationErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
    type: UnauthorizedErrorResponseDto,
  })
  @Post()
  createIndustry(
    @Body() createIndustryDto: CreateIndustryDto,
  ): Promise<IndustryResponseDto> {
    return this.industryService.createIndustry(createIndustryDto);
  }

  @ApiOperation({
    summary: 'Get all industries',
    operationId: 'findAllIndustries',
  })
  @ApiOkResponse({
    description: 'List of all industries',
    type: IndustryListResponseDto,
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    description: 'Number of records to skip',
  })
  @ApiQuery({
    name: 'take',
    required: false,
    description: 'Number of records to take',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ValidationErrorResponseDto,
  })
  @Get('all')
  findAllIndustries(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ): Promise<IndustryListResponseDto> {
    return this.industryService.findAllIndustries({
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
    });
  }

  @ApiOperation({
    summary: 'Get an industry by ID',
    operationId: 'findIndustryById',
  })
  @ApiOkResponse({
    description: 'Industry details including related entities',
    type: IndustryWithRelationsResponseDto,
  })
  @ApiParam({ name: 'id', description: 'Industry ID' })
  @ApiResponse({
    status: 404,
    description: 'Industry not found',
    type: NotFoundErrorResponseDto,
  })
  @Get(':id')
  findIndustryById(
    @Param('id') id: string,
  ): Promise<IndustryWithRelationsResponseDto> {
    return this.industryService.findIndustryById(id);
  }

  @ApiOperation({
    summary: 'Get an industry by slug',
    operationId: 'findIndustryBySlug',
  })
  @ApiOkResponse({
    description: 'Industry details including related entities',
    type: IndustryWithRelationsResponseDto,
  })
  @ApiParam({ name: 'slug', description: 'Industry slug' })
  @ApiResponse({
    status: 404,
    description: 'Industry not found',
    type: NotFoundErrorResponseDto,
  })
  @Get('slug/:slug')
  findIndustryBySlug(
    @Param('slug') slug: string,
  ): Promise<IndustryWithRelationsResponseDto> {
    return this.industryService.findIndustryBySlug(slug);
  }

  @ApiOperation({
    summary: 'Update an industry',
    operationId: 'updateIndustry',
  })
  @ApiBody({
    type: UpdateIndustryDto,
    description: 'Industry data to update',
    required: true,
  })
  @ApiOkResponse({
    description: 'Industry has been successfully updated',
    type: IndustryResponseDto,
  })
  @ApiParam({ name: 'id', description: 'Industry ID' })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ValidationErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Industry not found',
    type: NotFoundErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
    type: UnauthorizedErrorResponseDto,
  })
  @Put(':id')
  updateIndustry(
    @Param('id') id: string,
    @Body() updateIndustryDto: UpdateIndustryDto,
  ): Promise<IndustryResponseDto> {
    return this.industryService.updateIndustry(id, updateIndustryDto);
  }

  @ApiOperation({
    summary: 'Delete an industry',
    operationId: 'deleteIndustry',
  })
  @ApiOkResponse({
    description: 'Industry has been successfully deleted',
    type: IndustryResponseDto,
  })
  @ApiParam({ name: 'id', description: 'Industry ID' })
  @ApiResponse({
    status: 404,
    description: 'Industry not found',
    type: NotFoundErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
    type: UnauthorizedErrorResponseDto,
  })
  @Delete(':id')
  deleteIndustry(@Param('id') id: string): Promise<IndustryResponseDto> {
    return this.industryService.deleteIndustry(id);
  }

  // Legacy endpoint for backward compatibility
  @ApiOperation({
    summary: 'Get all industries with their associated data',
    operationId: 'getIndustries',
  })
  @ApiOkResponse({
    description:
      'List of all industries with categories, sources, and channels',
    type: IndustryListResponseDto,
  })
  @Get()
  async getIndustries(): Promise<IndustryListResponseDto> {
    return this.industryService.getAll();
  }
}
