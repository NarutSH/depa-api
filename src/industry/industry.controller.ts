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
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';
import { IndustryResponseDto } from './dto/industry-response.dto';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { FindTagsQueryDto } from './dto/find-tags-query.dto';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { FindChannelsQueryDto } from './dto/find-channels-query.dto';
import {
  IndustryBasicResponse,
  IndustryWithAllRelations,
  SkillWithIndustry,
  TagWithIndustry,
  ChannelWithIndustry,
  SkillResponse,
  TagResponse,
  ChannelResponse,
  IndustryBasicResponseDto,
  SkillResponseDto,
  TagResponseDto,
  ChannelResponseDto,
} from './dto/industry-response.dto';
import { Industry, Skill, Tag, Channel } from 'generated/prisma';

@ApiTags('Industry')
@ApiBearerAuth()
@Controller('industry')
export class IndustryController {
  constructor(private readonly industryService: IndustryService) {}

  // Industry CRUD endpoints

  @ApiOperation({ summary: 'Create a new industry' })
  @ApiCreatedResponse({
    description: 'Industry has been successfully created',
    type: IndustryResponseDto,
  })
  @Post()
  createIndustry(
    @Body() createIndustryDto: CreateIndustryDto,
  ): Promise<Industry> {
    return this.industryService.createIndustry(createIndustryDto);
  }

  @ApiOperation({ summary: 'Get all industries with pagination' })
  @ApiOkResponse({
    description: 'List of industries with pagination support',
    type: () => [IndustryResponseDto],
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    description: 'Number of records to skip for pagination',
    type: Number,
  })
  @ApiQuery({
    name: 'take',
    required: false,
    description: 'Number of records to take for pagination',
    type: Number,
  })
  @Get('all')
  findAllIndustries(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ): Promise<Industry[]> {
    return this.industryService.findAllIndustries({
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
    });
  }

  @ApiOperation({ summary: 'Get an industry by ID with all relations' })
  @ApiOkResponse({
    description: 'Industry details including all related entities',
    schema: {
      allOf: [
        { $ref: '#/components/schemas/Industry' },
        {
          type: 'object',
          properties: {
            Category: {
              type: 'array',
              items: { type: 'object' },
              description: 'Industry categories',
            },
            Channel: {
              type: 'array',
              items: { type: 'object' },
              description: 'Industry channels',
            },
            Source: {
              type: 'array',
              items: { type: 'object' },
              description: 'Industry sources',
            },
            Segment: {
              type: 'array',
              items: { type: 'object' },
              description: 'Industry segments',
            },
            Skill: {
              type: 'array',
              items: { type: 'object' },
              description: 'Industry skills',
            },
            Tag: {
              type: 'array',
              items: { type: 'object' },
              description: 'Industry tags',
            },
            LookingFor: {
              type: 'array',
              items: { type: 'object' },
              description: 'Looking for options',
            },
          },
        },
      ],
    },
  })
  @ApiParam({ name: 'id', description: 'Industry unique identifier' })
  @Get(':id')
  findIndustryById(@Param('id') id: string): Promise<IndustryWithAllRelations> {
    return this.industryService.findIndustryById(id);
  }

  @ApiOperation({ summary: 'Get an industry by slug with all relations' })
  @ApiOkResponse({
    description: 'Industry details including all related entities',
    schema: {
      allOf: [
        { $ref: '#/components/schemas/Industry' },
        {
          type: 'object',
          properties: {
            Category: {
              type: 'array',
              items: { type: 'object' },
              description: 'Industry categories',
            },
            Channel: {
              type: 'array',
              items: { type: 'object' },
              description: 'Industry channels',
            },
            Source: {
              type: 'array',
              items: { type: 'object' },
              description: 'Industry sources',
            },
            Segment: {
              type: 'array',
              items: { type: 'object' },
              description: 'Industry segments',
            },
            Skill: {
              type: 'array',
              items: { type: 'object' },
              description: 'Industry skills',
            },
            Tag: {
              type: 'array',
              items: { type: 'object' },
              description: 'Industry tags',
            },
            LookingFor: {
              type: 'array',
              items: { type: 'object' },
              description: 'Looking for options',
            },
          },
        },
      ],
    },
  })
  @ApiParam({ name: 'slug', description: 'Industry slug identifier' })
  @Get('slug/:slug')
  findIndustryBySlug(
    @Param('slug') slug: string,
  ): Promise<IndustryWithAllRelations> {
    return this.industryService.findIndustryBySlug(slug);
  }

  @ApiOperation({ summary: 'Update an industry' })
  @ApiOkResponse({
    description: 'Industry has been successfully updated',
    type: IndustryResponseDto,
  })
  @ApiParam({ name: 'id', description: 'Industry unique identifier' })
  @Put(':id')
  updateIndustry(
    @Param('id') id: string,
    @Body() updateIndustryDto: UpdateIndustryDto,
  ): Promise<Industry> {
    return this.industryService.updateIndustry(id, updateIndustryDto);
  }

  @ApiOperation({ summary: 'Delete an industry' })
  @ApiOkResponse({
    description: 'Industry has been successfully deleted',
    type: IndustryResponseDto,
  })
  @ApiParam({ name: 'id', description: 'Industry unique identifier' })
  @Delete(':id')
  deleteIndustry(@Param('id') id: string): Promise<Industry> {
    return this.industryService.deleteIndustry(id);
  }

  // Existing endpoints

  @ApiOperation({ summary: 'Get all industries with their associated data' })
  @ApiOkResponse({
    description:
      'List of all industries with categories, sources, and channels',
    type: () => [IndustryBasicResponseDto],
  })
  @Get()
  async getIndustries(): Promise<IndustryBasicResponse[]> {
    return this.industryService.getAll();
  }

  @ApiOperation({ summary: 'Create a new skill' })
  @ApiCreatedResponse({
    description: 'The skill has been successfully created',
    type: SkillResponseDto,
  })
  @Post('skills')
  createSkill(@Body() createSkillDto: CreateSkillDto): Promise<Skill> {
    return this.industryService.createSkill(createSkillDto);
  }

  @ApiOperation({ summary: 'Get all skills with optional filtering' })
  @ApiOkResponse({
    description: 'List of skills matching the query criteria',
    type: () => [SkillResponseDto],
  })
  @ApiQuery({
    name: 'industrySlug',
    required: false,
    description: 'Filter skills by industry slug',
    type: String,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search skills by title',
    type: String,
  })
  @Get('skills/all')
  findAllSkills(@Query() query: FindSkillsQueryDto): Promise<SkillResponse[]> {
    return this.industryService.findAllSkills(query);
  }

  @ApiOperation({ summary: 'Get a skill by its slug' })
  @ApiParam({ name: 'slug', description: 'Skill slug identifier' })
  @ApiQuery({
    name: 'industrySlug',
    required: false,
    description: 'Optional industry slug to filter by',
    type: String,
  })
  @ApiOkResponse({
    description: 'The skill data with industry information',
    schema: {
      allOf: [
        { $ref: '#/components/schemas/Skill' },
        {
          type: 'object',
          properties: {
            industry: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'Information Technology' },
                slug: { type: 'string', example: 'information-technology' },
                color: { type: 'string', example: '#3498db' },
              },
            },
          },
        },
      ],
    },
  })
  @Get('skills/:slug')
  findSkillBySlug(
    @Param('slug') slug: string,
    @Query('industrySlug') industrySlug?: string,
  ): Promise<SkillWithIndustry> {
    return this.industryService.findSkillBySlug(slug, industrySlug);
  }

  @ApiOperation({ summary: 'Update an existing skill' })
  @ApiParam({ name: 'slug', description: 'Skill slug identifier to update' })
  @ApiOkResponse({
    description: 'The skill has been successfully updated',
    type: SkillResponseDto,
  })
  @Put('skills/:slug')
  updateSkill(
    @Param('slug') slug: string,
    @Body() updateSkillDto: UpdateSkillDto,
  ): Promise<Skill> {
    return this.industryService.updateSkill(slug, updateSkillDto);
  }

  @ApiOperation({ summary: 'Delete a skill' })
  @ApiParam({ name: 'slug', description: 'Skill slug identifier to delete' })
  @ApiOkResponse({
    description: 'The skill has been successfully deleted',
    type: SkillResponseDto,
  })
  @Delete('skills/:slug')
  deleteSkill(@Param('slug') slug: string): Promise<Skill> {
    return this.industryService.deleteSkill(slug);
  }

  @ApiOperation({ summary: 'Create a new tag' })
  @ApiCreatedResponse({
    description: 'The tag has been successfully created',
    type: TagResponseDto,
  })
  @Post('tags')
  createTag(@Body() createTagDto: CreateTagDto): Promise<Tag> {
    return this.industryService.createTag(createTagDto);
  }

  @ApiOperation({ summary: 'Get all tags with optional filtering' })
  @ApiOkResponse({
    description: 'List of tags matching the query criteria',
    type: () => [TagResponseDto],
  })
  @ApiQuery({
    name: 'industrySlug',
    required: false,
    description: 'Filter tags by industry slug',
    type: String,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search tags by name',
    type: String,
  })
  @Get('tags/all')
  findAllTags(@Query() query: FindTagsQueryDto): Promise<TagResponse[]> {
    return this.industryService.findAllTags(query);
  }

  @ApiOperation({ summary: 'Get a tag by its slug' })
  @ApiParam({ name: 'slug', description: 'Tag slug identifier' })
  @ApiQuery({
    name: 'industrySlug',
    required: false,
    description: 'Optional industry slug to filter by',
    type: String,
  })
  @ApiOkResponse({
    description: 'The tag data with industry information',
    schema: {
      allOf: [
        { $ref: '#/components/schemas/Tag' },
        {
          type: 'object',
          properties: {
            industry: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'Information Technology' },
                slug: { type: 'string', example: 'information-technology' },
                color: { type: 'string', example: '#3498db' },
              },
            },
          },
        },
      ],
    },
  })
  @Get('tags/:slug')
  findTagBySlug(
    @Param('slug') slug: string,
    @Query('industrySlug') industrySlug?: string,
  ): Promise<TagWithIndustry> {
    return this.industryService.findTagBySlug(slug, industrySlug);
  }

  @ApiOperation({ summary: 'Update an existing tag' })
  @ApiParam({ name: 'slug', description: 'Tag slug identifier to update' })
  @ApiOkResponse({
    description: 'The tag has been successfully updated',
    type: TagResponseDto,
  })
  @Put('tags/:slug')
  updateTag(
    @Param('slug') slug: string,
    @Body() updateTagDto: UpdateTagDto,
  ): Promise<Tag> {
    return this.industryService.updateTag(slug, updateTagDto);
  }

  @ApiOperation({ summary: 'Delete a tag' })
  @ApiParam({ name: 'slug', description: 'Tag slug identifier to delete' })
  @ApiOkResponse({
    description: 'The tag has been successfully deleted',
    type: TagResponseDto,
  })
  @Delete('tags/:slug')
  deleteTag(@Param('slug') slug: string): Promise<Tag> {
    return this.industryService.deleteTag(slug);
  }

  @ApiOperation({ summary: 'Create a new channel' })
  @ApiCreatedResponse({
    description: 'The channel has been successfully created',
    type: ChannelResponseDto,
  })
  @Post('channels')
  createChannel(@Body() createChannelDto: CreateChannelDto): Promise<Channel> {
    return this.industryService.createChannel(createChannelDto);
  }

  @ApiOperation({ summary: 'Get all channels with optional filtering' })
  @ApiOkResponse({
    description: 'List of channels matching the query criteria',
    type: () => [ChannelResponseDto],
  })
  @ApiQuery({
    name: 'industrySlug',
    required: false,
    description: 'Filter channels by industry slug',
    type: String,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search channels by name',
    type: String,
  })
  @Get('channels/all')
  findAllChannels(
    @Query() query: FindChannelsQueryDto,
  ): Promise<ChannelResponse[]> {
    return this.industryService.findAllChannels(query);
  }

  @ApiOperation({ summary: 'Get a channel by its slug' })
  @ApiParam({ name: 'slug', description: 'Channel slug identifier' })
  @ApiQuery({
    name: 'industrySlug',
    required: false,
    description: 'Optional industry slug to filter by',
    type: String,
  })
  @ApiOkResponse({
    description: 'The channel data with industry information',
    schema: {
      allOf: [
        { $ref: '#/components/schemas/Channel' },
        {
          type: 'object',
          properties: {
            industry: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'Information Technology' },
                slug: { type: 'string', example: 'information-technology' },
                color: { type: 'string', example: '#3498db' },
              },
            },
          },
        },
      ],
    },
  })
  @Get('channels/:slug')
  findChannelBySlug(
    @Param('slug') slug: string,
    @Query('industrySlug') industrySlug?: string,
  ): Promise<ChannelWithIndustry> {
    return this.industryService.findChannelBySlug(slug, industrySlug);
  }

  @ApiOperation({ summary: 'Update an existing channel' })
  @ApiParam({ name: 'slug', description: 'Channel slug identifier to update' })
  @ApiOkResponse({
    description: 'The channel has been successfully updated',
    type: ChannelResponseDto,
  })
  @Put('channels/:slug')
  updateChannel(
    @Param('slug') slug: string,
    @Body() updateChannelDto: UpdateChannelDto,
  ): Promise<Channel> {
    return this.industryService.updateChannel(slug, updateChannelDto);
  }

  @ApiOperation({ summary: 'Delete a channel' })
  @ApiParam({ name: 'slug', description: 'Channel slug identifier to delete' })
  @ApiOkResponse({
    description: 'The channel has been successfully deleted',
    type: ChannelResponseDto,
  })
  @Delete('channels/:slug')
  deleteChannel(@Param('slug') slug: string): Promise<Channel> {
    return this.industryService.deleteChannel(slug);
  }
}
