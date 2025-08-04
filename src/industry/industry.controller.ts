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
import { IndustryService } from './industry.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { FindSkillsQueryDto } from './dto/find-skills-query.dto';
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
  SkillResponseDto,
  SkillListResponseDto,
} from './dto/skill-response.dto';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';
import {
  IndustryResponseDto,
  IndustryWithRelationsResponseDto,
  IndustryListResponseDto,
} from './dto/industry-response.dto';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { FindTagsQueryDto } from './dto/find-tags-query.dto';
import { TagResponseDto, TagListResponseDto } from './dto/tag-response.dto';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { FindChannelsQueryDto } from './dto/find-channels-query.dto';
import {
  ChannelResponseDto,
  ChannelListResponseDto,
} from './dto/channel-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FindCategoriesQueryDto } from './dto/find-categories-query.dto';
import {
  CategoryResponseDto,
  CategoryListResponseDto,
} from './dto/category-response.dto';
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

  // Existing endpoints

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

  @ApiOperation({
    summary: 'Create a new skill',
    operationId: 'createSkill',
  })
  @ApiBody({
    type: CreateSkillDto,
    description: 'Skill data to create',
    required: true,
  })
  @ApiCreatedResponse({
    description: 'The skill has been successfully created',
    type: SkillResponseDto,
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
  @Post('skills')
  createSkill(
    @Body() createSkillDto: CreateSkillDto,
  ): Promise<SkillResponseDto> {
    return this.industryService.createSkill(createSkillDto);
  }

  @ApiOperation({
    summary: 'Get all skills with optional filtering',
    operationId: 'findAllSkills',
  })
  @ApiOkResponse({
    description: 'List of skills matching the query criteria',
    type: SkillListResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ValidationErrorResponseDto,
  })
  @Get('skills/all')
  findAllSkills(
    @Query() query: FindSkillsQueryDto,
  ): Promise<SkillListResponseDto> {
    return this.industryService.findAllSkills(query);
  }

  @ApiOperation({
    summary: 'Get a skill by its slug',
    operationId: 'findSkillBySlug',
  })
  @ApiParam({ name: 'slug', description: 'Skill slug identifier' })
  @ApiQuery({
    name: 'industrySlug',
    required: false,
    description: 'Optional industry slug to filter by',
  })
  @ApiOkResponse({
    description: 'The skill data',
    type: SkillResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Skill not found',
    type: NotFoundErrorResponseDto,
  })
  @Get('skills/:slug')
  findSkillBySlug(
    @Param('slug') slug: string,
    @Query('industrySlug') industrySlug?: string,
  ): Promise<SkillResponseDto> {
    return this.industryService.findSkillBySlug(slug, industrySlug);
  }

  @ApiOperation({
    summary: 'Update an existing skill',
    operationId: 'updateSkill',
  })
  @ApiBody({
    type: UpdateSkillDto,
    description: 'Skill data to update',
    required: true,
  })
  @ApiParam({ name: 'slug', description: 'Skill slug identifier to update' })
  @ApiOkResponse({
    description: 'The skill has been successfully updated',
    type: SkillResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ValidationErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Skill not found',
    type: NotFoundErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
    type: UnauthorizedErrorResponseDto,
  })
  @Put('skills/:slug')
  updateSkill(
    @Param('slug') slug: string,
    @Body() updateSkillDto: UpdateSkillDto,
  ): Promise<SkillResponseDto> {
    return this.industryService.updateSkill(slug, updateSkillDto);
  }

  @ApiOperation({
    summary: 'Delete a skill',
    operationId: 'deleteSkill',
  })
  @ApiParam({ name: 'slug', description: 'Skill slug identifier to delete' })
  @ApiOkResponse({
    description: 'The skill has been successfully deleted',
    type: SkillResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Skill not found',
    type: NotFoundErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
    type: UnauthorizedErrorResponseDto,
  })
  @Delete('skills/:slug')
  deleteSkill(@Param('slug') slug: string) {
    return this.industryService.deleteSkill(slug);
  }

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
  @Post('tags')
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
  @Get('tags/all')
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
  @Get('tags/:slug')
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
  @Put('tags/:slug')
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
  @Delete('tags/:slug')
  deleteTag(@Param('slug') slug: string) {
    return this.industryService.deleteTag(slug);
  }

  @ApiOperation({
    summary: 'Create a new channel',
    operationId: 'createChannel',
  })
  @ApiBody({
    type: CreateChannelDto,
    description: 'Channel data to create',
    required: true,
  })
  @ApiCreatedResponse({
    description: 'The channel has been successfully created',
    type: ChannelResponseDto,
  })
  @Post('channels')
  createChannel(@Body() createChannelDto: CreateChannelDto) {
    return this.industryService.createChannel(createChannelDto);
  }

  @ApiOperation({
    summary: 'Get all channels with optional filtering',
    operationId: 'findAllChannels',
  })
  @ApiOkResponse({
    description: 'List of channels matching the query criteria',
    type: ChannelListResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ValidationErrorResponseDto,
  })
  @Get('channels/all')
  findAllChannels(
    @Query() query: FindChannelsQueryDto,
  ): Promise<ChannelListResponseDto> {
    return this.industryService.findAllChannels(query);
  }

  @ApiOperation({
    summary: 'Get a channel by its slug',
    operationId: 'findChannelBySlug',
  })
  @ApiParam({ name: 'slug', description: 'Channel slug identifier' })
  @ApiQuery({
    name: 'industrySlug',
    required: false,
    description: 'Optional industry slug to filter by',
  })
  @ApiOkResponse({
    description: 'The channel data',
    type: ChannelResponseDto,
  })
  @Get('channels/:slug')
  findChannelBySlug(
    @Param('slug') slug: string,
    @Query('industrySlug') industrySlug?: string,
  ) {
    return this.industryService.findChannelBySlug(slug, industrySlug);
  }

  @ApiOperation({
    summary: 'Update an existing channel',
    operationId: 'updateChannel',
  })
  @ApiBody({
    type: UpdateChannelDto,
    description: 'Channel data to update',
    required: true,
  })
  @ApiParam({ name: 'slug', description: 'Channel slug identifier to update' })
  @ApiOkResponse({
    description: 'The channel has been successfully updated',
    type: ChannelResponseDto,
  })
  @Put('channels/:slug')
  updateChannel(
    @Param('slug') slug: string,
    @Body() updateChannelDto: UpdateChannelDto,
  ) {
    return this.industryService.updateChannel(slug, updateChannelDto);
  }

  @ApiOperation({
    summary: 'Delete a channel',
    operationId: 'deleteChannel',
  })
  @ApiParam({ name: 'slug', description: 'Channel slug identifier to delete' })
  @ApiOkResponse({
    description: 'The channel has been successfully deleted',
    type: ChannelResponseDto,
  })
  @Delete('channels/:slug')
  deleteChannel(@Param('slug') slug: string) {
    return this.industryService.deleteChannel(slug);
  }

  @ApiOperation({
    summary: 'Create a new category',
    operationId: 'createCategory',
  })
  @ApiBody({
    type: CreateCategoryDto,
    description: 'Category data to create',
    required: true,
  })
  @ApiCreatedResponse({
    description: 'The category has been successfully created',
    type: CategoryResponseDto,
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
  @Post('categories')
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.industryService.createCategory(createCategoryDto);
  }

  @ApiOperation({
    summary: 'Get all categories with optional filtering',
    operationId: 'findAllCategories',
  })
  @ApiOkResponse({
    description: 'List of categories matching the query criteria',
    type: CategoryListResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ValidationErrorResponseDto,
  })
  @Get('categories/all')
  findAllCategories(
    @Query() query: FindCategoriesQueryDto,
  ): Promise<CategoryListResponseDto> {
    return this.industryService.findAllCategories(query);
  }

  @ApiOperation({
    summary: 'Get a category by its slug',
    operationId: 'findCategoryBySlug',
  })
  @ApiParam({ name: 'slug', description: 'Category slug identifier' })
  @ApiQuery({
    name: 'industrySlug',
    required: false,
    description: 'Optional industry slug to filter by',
  })
  @ApiOkResponse({
    description: 'The category data',
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
    type: NotFoundErrorResponseDto,
  })
  @Get('categories/:slug')
  findCategoryBySlug(
    @Param('slug') slug: string,
    @Query('industrySlug') industrySlug?: string,
  ) {
    return this.industryService.findCategoryBySlug(slug, industrySlug);
  }

  @ApiOperation({
    summary: 'Update an existing category',
    operationId: 'updateCategory',
  })
  @ApiBody({
    type: UpdateCategoryDto,
    description: 'Category data to update',
    required: true,
  })
  @ApiParam({ name: 'slug', description: 'Category slug identifier to update' })
  @ApiOkResponse({
    description: 'The category has been successfully updated',
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ValidationErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
    type: NotFoundErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
    type: UnauthorizedErrorResponseDto,
  })
  @Put('categories/:slug')
  updateCategory(
    @Param('slug') slug: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.industryService.updateCategory(slug, updateCategoryDto);
  }

  @ApiOperation({
    summary: 'Delete a category',
    operationId: 'deleteCategory',
  })
  @ApiParam({ name: 'slug', description: 'Category slug identifier to delete' })
  @ApiOkResponse({
    description: 'The category has been successfully deleted',
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
    type: NotFoundErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
    type: UnauthorizedErrorResponseDto,
  })
  @Delete('categories/:slug')
  deleteCategory(@Param('slug') slug: string) {
    return this.industryService.deleteCategory(slug);
  }
}
