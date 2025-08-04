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
import { CreateSourceDto } from '../dto/create-source.dto';
import { UpdateSourceDto } from '../dto/update-source.dto';
import { FindSourcesQueryDto } from '../dto/find-sources-query.dto';
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
import {
  SourceResponseDto,
  SourceListResponseDto,
} from '../dto/source-response.dto';
import {
  ValidationErrorResponseDto,
  NotFoundErrorResponseDto,
  UnauthorizedErrorResponseDto,
} from 'src/utils/dtos/error-response.dto';

@ApiTags('Industry - Sources')
@ApiBearerAuth()
@Controller('industry/sources')
export class SourceController {
  constructor(private readonly industryService: IndustryService) {}

  @ApiOperation({
    summary: 'Create a new source',
    operationId: 'createSource',
  })
  @ApiBody({
    type: CreateSourceDto,
    description: 'Source data to create',
    required: true,
  })
  @ApiCreatedResponse({
    description: 'The source has been successfully created',
    type: SourceResponseDto,
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
  createSource(@Body() createSourceDto: CreateSourceDto) {
    return this.industryService.createSource(createSourceDto);
  }

  @ApiOperation({
    summary: 'Get all sources with optional filtering',
    operationId: 'findAllSources',
  })
  @ApiOkResponse({
    description: 'List of sources matching the query criteria',
    type: SourceListResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ValidationErrorResponseDto,
  })
  @Get('all')
  findAllSources(
    @Query() query: FindSourcesQueryDto,
  ): Promise<SourceListResponseDto> {
    return this.industryService.findAllSources(query);
  }

  @ApiOperation({
    summary: 'Get a source by its slug',
    operationId: 'findSourceBySlug',
  })
  @ApiParam({ name: 'slug', description: 'Source slug identifier' })
  @ApiQuery({
    name: 'industrySlug',
    required: false,
    description: 'Optional industry slug to filter by',
  })
  @ApiOkResponse({
    description: 'The source data',
    type: SourceResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Source not found',
    type: NotFoundErrorResponseDto,
  })
  @Get(':slug')
  findSourceBySlug(
    @Param('slug') slug: string,
    @Query('industrySlug') industrySlug?: string,
  ) {
    return this.industryService.findSourceBySlug(slug, industrySlug);
  }

  @ApiOperation({
    summary: 'Update an existing source',
    operationId: 'updateSource',
  })
  @ApiBody({
    type: UpdateSourceDto,
    description: 'Source data to update',
    required: true,
  })
  @ApiParam({ name: 'slug', description: 'Source slug identifier to update' })
  @ApiOkResponse({
    description: 'The source has been successfully updated',
    type: SourceResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ValidationErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Source not found',
    type: NotFoundErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
    type: UnauthorizedErrorResponseDto,
  })
  @Put(':slug')
  updateSource(
    @Param('slug') slug: string,
    @Body() updateSourceDto: UpdateSourceDto,
  ) {
    return this.industryService.updateSource(slug, updateSourceDto);
  }

  @ApiOperation({
    summary: 'Delete a source',
    operationId: 'deleteSource',
  })
  @ApiParam({ name: 'slug', description: 'Source slug identifier to delete' })
  @ApiOkResponse({
    description: 'The source has been successfully deleted',
    type: SourceResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Source not found',
    type: NotFoundErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
    type: UnauthorizedErrorResponseDto,
  })
  @Delete(':slug')
  deleteSource(@Param('slug') slug: string) {
    return this.industryService.deleteSource(slug);
  }
}
