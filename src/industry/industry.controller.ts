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
import { SkillResponseDto } from './dto/skill-response.dto';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';
import { IndustryResponseDto } from './dto/industry-response.dto';

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
  createIndustry(@Body() createIndustryDto: CreateIndustryDto) {
    return this.industryService.createIndustry(createIndustryDto);
  }

  @ApiOperation({ summary: 'Get all industries' })
  @ApiOkResponse({
    description: 'List of all industries',
    type: [IndustryResponseDto],
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
  @Get('all')
  findAllIndustries(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.industryService.findAllIndustries({
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
    });
  }

  @ApiOperation({ summary: 'Get an industry by ID' })
  @ApiOkResponse({
    description: 'Industry details including related entities',
    type: IndustryResponseDto,
  })
  @ApiParam({ name: 'id', description: 'Industry ID' })
  @Get(':id')
  findIndustryById(@Param('id') id: string) {
    return this.industryService.findIndustryById(id);
  }

  @ApiOperation({ summary: 'Get an industry by slug' })
  @ApiOkResponse({
    description: 'Industry details including related entities',
    type: IndustryResponseDto,
  })
  @ApiParam({ name: 'slug', description: 'Industry slug' })
  @Get('slug/:slug')
  findIndustryBySlug(@Param('slug') slug: string) {
    return this.industryService.findIndustryBySlug(slug);
  }

  @ApiOperation({ summary: 'Update an industry' })
  @ApiOkResponse({
    description: 'Industry has been successfully updated',
    type: IndustryResponseDto,
  })
  @ApiParam({ name: 'id', description: 'Industry ID' })
  @Put(':id')
  updateIndustry(
    @Param('id') id: string,
    @Body() updateIndustryDto: UpdateIndustryDto,
  ) {
    return this.industryService.updateIndustry(id, updateIndustryDto);
  }

  @ApiOperation({ summary: 'Delete an industry' })
  @ApiOkResponse({
    description: 'Industry has been successfully deleted',
    type: IndustryResponseDto,
  })
  @ApiParam({ name: 'id', description: 'Industry ID' })
  @Delete(':id')
  deleteIndustry(@Param('id') id: string) {
    return this.industryService.deleteIndustry(id);
  }

  // Existing endpoints

  @ApiOperation({ summary: 'Get all industries with their associated data' })
  @ApiOkResponse({
    description:
      'List of all industries with categories, sources, and channels',
  })
  @Get()
  async getIndustries() {
    return this.industryService.getAll();
  }

  @ApiOperation({ summary: 'Get all industries with their skills' })
  @ApiOkResponse({
    description: 'List of all industries with their associated skills',
  })
  @Get('skills')
  async getSkills() {
    return this.industryService.getSkills();
  }

  // Skill CRUD endpoints

  @ApiOperation({ summary: 'Create a new skill' })
  @ApiCreatedResponse({
    description: 'The skill has been successfully created',
    type: SkillResponseDto,
  })
  @Post('skills')
  createSkill(@Body() createSkillDto: CreateSkillDto) {
    return this.industryService.createSkill(createSkillDto);
  }

  @ApiOperation({ summary: 'Get all skills with optional filtering' })
  @ApiOkResponse({
    description: 'List of skills matching the query criteria',
    type: [SkillResponseDto],
  })
  @Get('skills/all')
  findAllSkills(@Query() query: FindSkillsQueryDto) {
    return this.industryService.findAllSkills(query);
  }

  @ApiOperation({ summary: 'Get a skill by its slug' })
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
  @Get('skills/:slug')
  findSkillBySlug(
    @Param('slug') slug: string,
    @Query('industrySlug') industrySlug?: string,
  ) {
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
  ) {
    return this.industryService.updateSkill(slug, updateSkillDto);
  }

  @ApiOperation({ summary: 'Delete a skill' })
  @ApiParam({ name: 'slug', description: 'Skill slug identifier to delete' })
  @ApiOkResponse({
    description: 'The skill has been successfully deleted',
    type: SkillResponseDto,
  })
  @Delete('skills/:slug')
  deleteSkill(@Param('slug') slug: string) {
    return this.industryService.deleteSkill(slug);
  }
}
