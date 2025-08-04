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
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { FindCategoriesQueryDto } from '../dto/find-categories-query.dto';
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
  CategoryResponseDto,
  CategoryListResponseDto,
} from '../dto/category-response.dto';
import {
  ValidationErrorResponseDto,
  NotFoundErrorResponseDto,
  UnauthorizedErrorResponseDto,
} from 'src/utils/dtos/error-response.dto';

@ApiTags('Industry - Categories')
@ApiBearerAuth()
@Controller('industry/categories')
export class CategoryController {
  constructor(private readonly industryService: IndustryService) {}

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
  @Post()
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
  @Get('all')
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
  @Get(':slug')
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
  @Put(':slug')
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
  @Delete(':slug')
  deleteCategory(@Param('slug') slug: string) {
    return this.industryService.deleteCategory(slug);
  }
}
