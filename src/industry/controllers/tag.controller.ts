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
import { CreateTagDto } from '../dto/create-tag.dto';
import { UpdateTagDto } from '../dto/update-tag.dto';
import { FindTagsQueryDto } from '../dto/find-tags-query.dto';
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
import { TagResponseDto, TagListResponseDto } from '../dto/tag-response.dto';
import {
  ValidationErrorResponseDto,
  NotFoundErrorResponseDto,
  UnauthorizedErrorResponseDto,
} from 'src/utils/dtos/error-response.dto';

@ApiTags('Industry - Tags')
@ApiBearerAuth()
@Controller('industry/tags')
export class TagController {
  constructor(private readonly industryService: IndustryService) {}

  @ApiOperation({
    summary: 'Create a new tag',
    operationId: 'createTag',
  })
  @ApiBody({
    type: CreateTagDto,
    description: 'Tag data to create',
    required: true,
  })
  @ApiCreatedResponse({
    description: 'The tag has been successfully created',
    type: TagResponseDto,
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
  createTag(@Body() createTagDto: CreateTagDto): Promise<TagResponseDto> {
    return this.industryService.createTag(createTagDto);
  }

  @ApiOperation({
    summary: 'Get all tags with optional filtering',
    operationId: 'findAllTags',
  })
  @ApiOkResponse({
    description: 'List of tags matching the query criteria',
    type: TagListResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ValidationErrorResponseDto,
  })
  @Get('all')
  findAllTags(@Query() query: FindTagsQueryDto): Promise<TagListResponseDto> {
    return this.industryService.findAllTags(query);
  }

  @ApiOperation({
    summary: 'Get a tag by its slug',
    operationId: 'findTagBySlug',
  })
  @ApiParam({ name: 'slug', description: 'Tag slug identifier' })
  @ApiQuery({
    name: 'industrySlug',
    required: false,
    description: 'Optional industry slug to filter by',
  })
  @ApiOkResponse({
    description: 'The tag data',
    type: TagResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Tag not found',
    type: NotFoundErrorResponseDto,
  })
  @Get(':slug')
  findTagBySlug(
    @Param('slug') slug: string,
    @Query('industrySlug') industrySlug?: string,
  ) {
    return this.industryService.findTagBySlug(slug, industrySlug);
  }

  @ApiOperation({
    summary: 'Update an existing tag',
    operationId: 'updateTag',
  })
  @ApiBody({
    type: UpdateTagDto,
    description: 'Tag data to update',
    required: true,
  })
  @ApiParam({ name: 'slug', description: 'Tag slug identifier to update' })
  @ApiOkResponse({
    description: 'The tag has been successfully updated',
    type: TagResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ValidationErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Tag not found',
    type: NotFoundErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
    type: UnauthorizedErrorResponseDto,
  })
  @Put(':slug')
  updateTag(@Param('slug') slug: string, @Body() updateTagDto: UpdateTagDto) {
    return this.industryService.updateTag(slug, updateTagDto);
  }

  @ApiOperation({
    summary: 'Delete a tag',
    operationId: 'deleteTag',
  })
  @ApiParam({ name: 'slug', description: 'Tag slug identifier to delete' })
  @ApiOkResponse({
    description: 'The tag has been successfully deleted',
    type: TagResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Tag not found',
    type: NotFoundErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
    type: UnauthorizedErrorResponseDto,
  })
  @Delete(':slug')
  deleteTag(@Param('slug') slug: string) {
    return this.industryService.deleteTag(slug);
  }
}
