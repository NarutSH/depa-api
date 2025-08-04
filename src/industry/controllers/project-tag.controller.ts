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
import { CreateProjectTagDto } from '../dto/create-project-tag.dto';
import { UpdateProjectTagDto } from '../dto/update-project-tag.dto';
import { FindProjectTagDto } from '../dto/find-project-tag.dto';
import { ProjectTagResponseDto } from '../dto/project-tag-response.dto';

@ApiTags('Project Tags')
@Controller('industry/project-tags')
export class ProjectTagController {
  constructor(private readonly industryService: IndustryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project tag' })
  @ApiResponse({
    status: 201,
    description: 'The project tag has been successfully created.',
    type: ProjectTagResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 409, description: 'Project tag already exists.' })
  async create(
    @Body() createProjectTagDto: CreateProjectTagDto,
  ): Promise<ProjectTagResponseDto> {
    return this.industryService.createProjectTag(createProjectTagDto);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all project tags' })
  @ApiResponse({
    status: 200,
    description: 'Return all project tags.',
    type: [ProjectTagResponseDto],
  })
  async findAll(
    @Query() findProjectTagDto: FindProjectTagDto,
  ): Promise<ProjectTagResponseDto[]> {
    return this.industryService.findAllProjectTags(findProjectTagDto);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a project tag by slug' })
  @ApiParam({ name: 'slug', description: 'Project tag slug' })
  @ApiResponse({
    status: 200,
    description: 'Return the project tag.',
    type: ProjectTagResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Project tag not found.' })
  async findOne(@Param('slug') slug: string): Promise<ProjectTagResponseDto> {
    return this.industryService.findOneProjectTag(slug);
  }

  @Put(':slug')
  @ApiOperation({ summary: 'Update a project tag' })
  @ApiParam({ name: 'slug', description: 'Project tag slug' })
  @ApiResponse({
    status: 200,
    description: 'The project tag has been successfully updated.',
    type: ProjectTagResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Project tag not found.' })
  @ApiResponse({ status: 409, description: 'Project tag slug already exists.' })
  async update(
    @Param('slug') slug: string,
    @Body() updateProjectTagDto: UpdateProjectTagDto,
  ): Promise<ProjectTagResponseDto> {
    return this.industryService.updateProjectTag(slug, updateProjectTagDto);
  }

  @Delete(':slug')
  @ApiOperation({ summary: 'Delete a project tag' })
  @ApiParam({ name: 'slug', description: 'Project tag slug' })
  @ApiResponse({
    status: 200,
    description: 'The project tag has been successfully deleted.',
    type: ProjectTagResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Project tag not found.' })
  async remove(@Param('slug') slug: string): Promise<ProjectTagResponseDto> {
    return this.industryService.removeProjectTag(slug);
  }
}
