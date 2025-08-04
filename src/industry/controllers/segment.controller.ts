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
import { CreateSegmentDto } from '../dto/create-segment.dto';
import { UpdateSegmentDto } from '../dto/update-segment.dto';
import { FindSegmentsQueryDto } from '../dto/find-segments-query.dto';
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
  SegmentResponseDto,
  SegmentListResponseDto,
} from '../dto/segment-response.dto';
import {
  ValidationErrorResponseDto,
  NotFoundErrorResponseDto,
  UnauthorizedErrorResponseDto,
} from 'src/utils/dtos/error-response.dto';

@ApiTags('Industry - Segments')
@ApiBearerAuth()
@Controller('industry/segments')
export class SegmentController {
  constructor(private readonly industryService: IndustryService) {}

  @ApiOperation({
    summary: 'Create a new segment',
    operationId: 'createSegment',
  })
  @ApiBody({
    type: CreateSegmentDto,
    description: 'Segment data to create',
    required: true,
  })
  @ApiCreatedResponse({
    description: 'The segment has been successfully created',
    type: SegmentResponseDto,
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
  createSegment(@Body() createSegmentDto: CreateSegmentDto) {
    return this.industryService.createSegment(createSegmentDto);
  }

  @ApiOperation({
    summary: 'Get all segments with optional filtering',
    operationId: 'findAllSegments',
  })
  @ApiOkResponse({
    description: 'List of segments matching the query criteria',
    type: SegmentListResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ValidationErrorResponseDto,
  })
  @Get('all')
  findAllSegments(
    @Query() query: FindSegmentsQueryDto,
  ): Promise<SegmentListResponseDto> {
    return this.industryService.findAllSegments(query);
  }

  @ApiOperation({
    summary: 'Get a segment by its slug',
    operationId: 'findSegmentBySlug',
  })
  @ApiParam({ name: 'slug', description: 'Segment slug identifier' })
  @ApiQuery({
    name: 'industrySlug',
    required: false,
    description: 'Optional industry slug to filter by',
  })
  @ApiOkResponse({
    description: 'The segment data',
    type: SegmentResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Segment not found',
    type: NotFoundErrorResponseDto,
  })
  @Get(':slug')
  findSegmentBySlug(
    @Param('slug') slug: string,
    @Query('industrySlug') industrySlug?: string,
  ) {
    return this.industryService.findSegmentBySlug(slug, industrySlug);
  }

  @ApiOperation({
    summary: 'Update an existing segment',
    operationId: 'updateSegment',
  })
  @ApiBody({
    type: UpdateSegmentDto,
    description: 'Segment data to update',
    required: true,
  })
  @ApiParam({ name: 'slug', description: 'Segment slug identifier to update' })
  @ApiOkResponse({
    description: 'The segment has been successfully updated',
    type: SegmentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ValidationErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Segment not found',
    type: NotFoundErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
    type: UnauthorizedErrorResponseDto,
  })
  @Put(':slug')
  updateSegment(
    @Param('slug') slug: string,
    @Body() updateSegmentDto: UpdateSegmentDto,
  ) {
    return this.industryService.updateSegment(slug, updateSegmentDto);
  }

  @ApiOperation({
    summary: 'Delete a segment',
    operationId: 'deleteSegment',
  })
  @ApiParam({ name: 'slug', description: 'Segment slug identifier to delete' })
  @ApiOkResponse({
    description: 'The segment has been successfully deleted',
    type: SegmentResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Segment not found',
    type: NotFoundErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
    type: UnauthorizedErrorResponseDto,
  })
  @Delete(':slug')
  deleteSegment(@Param('slug') slug: string) {
    return this.industryService.deleteSegment(slug);
  }
}
