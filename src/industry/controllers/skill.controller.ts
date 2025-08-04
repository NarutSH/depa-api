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
import { CreateSkillDto } from '../dto/create-skill.dto';
import { UpdateSkillDto } from '../dto/update-skill.dto';
import { FindSkillsQueryDto } from '../dto/find-skills-query.dto';
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
} from '../dto/skill-response.dto';
import {
  ValidationErrorResponseDto,
  NotFoundErrorResponseDto,
  UnauthorizedErrorResponseDto,
} from 'src/utils/dtos/error-response.dto';

@ApiTags('Industry - Skills')
@ApiBearerAuth()
@Controller('industry/skills')
export class SkillController {
  constructor(private readonly industryService: IndustryService) {}

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
  @Post()
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
  @Get('all')
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
  @Get(':slug')
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
  @Put(':slug')
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
  @Delete(':slug')
  deleteSkill(@Param('slug') slug: string) {
    return this.industryService.deleteSkill(slug);
  }
}
