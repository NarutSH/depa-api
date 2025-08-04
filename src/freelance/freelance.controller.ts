import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { FreelanceService } from './freelance.service';
import { CreateFreelanceDto } from './dto/create-freelance.dto';
import { UpdateFreelanceDto } from './dto/update-freelance.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { QueryMetadataDto } from 'src/utils';
import { Public } from 'src/auth/decorators/public.decorator';
import {
  FreelanceListResponseDto,
  FreelanceResponseDto,
  FreelanceWithPortfolioResponseDto,
  FreelanceWithUserResponseDto,
} from './dto/freelance-response.dto';
import {
  ValidationErrorResponseDto,
  NotFoundErrorResponseDto,
  UnauthorizedErrorResponseDto,
} from 'src/utils/dtos/error-response.dto';

@ApiTags('Freelance')
@ApiBearerAuth()
@Controller('freelance')
export class FreelanceController {
  constructor(private readonly freelanceService: FreelanceService) {}

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Get all freelances with filtering and pagination',
    operationId: 'getFreelances',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page (default: 10)',
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search term for freelancer name or skills',
  })
  @ApiResponse({
    status: 200,
    description: 'Return a paginated list of freelances with their details',
    type: FreelanceListResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ValidationErrorResponseDto,
  })
  async getFreelances(
    @Query() query: QueryMetadataDto,
  ): Promise<FreelanceListResponseDto> {
    return this.freelanceService.getFreelances(query);
  }

  @Get('all')
  @Public()
  @ApiOperation({
    summary: 'Get all freelances with optional industry filter',
    operationId: 'getAllFreelances',
  })
  @ApiQuery({
    name: 'industry',
    required: false,
    description: 'Filter freelances by industry',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all freelances matching the optional industry filter',
    type: [FreelanceWithPortfolioResponseDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ValidationErrorResponseDto,
  })
  async getAl(
    @Query('industry') industry: string,
  ): Promise<FreelanceWithPortfolioResponseDto[]> {
    return this.freelanceService.getAl(industry);
  }

  @Get('/user/:userId')
  @ApiOperation({
    summary: 'Get freelance by user ID',
    operationId: 'getFreelanceByUserId',
  })
  @ApiParam({ name: 'userId', description: 'The user ID of the freelance' })
  @ApiResponse({
    status: 200,
    description: 'Return the freelance with the specified user ID',
    type: FreelanceWithUserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Freelance not found',
    type: NotFoundErrorResponseDto,
  })
  async getByUserId(
    @Param('userId') userId: string,
  ): Promise<FreelanceWithUserResponseDto> {
    return this.freelanceService.getByUserId(userId);
  }

  @Get('/:id')
  @Public()
  @ApiOperation({
    summary: 'Get freelance by ID',
    operationId: 'getFreelanceById',
  })
  @ApiParam({ name: 'id', description: 'The ID of the freelance' })
  @ApiResponse({
    status: 200,
    description: 'Return the freelance with the specified ID',
    type: FreelanceWithPortfolioResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Freelance not found',
    type: NotFoundErrorResponseDto,
  })
  async getById(
    @Param('id') id: string,
  ): Promise<FreelanceWithPortfolioResponseDto> {
    return this.freelanceService.getById(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create new freelance',
    operationId: 'createFreelance',
  })
  @ApiBody({
    type: CreateFreelanceDto,
    description: 'Freelance data to create',
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'The freelance has been successfully created',
    type: FreelanceResponseDto,
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
  async create(
    @Body() data: CreateFreelanceDto,
  ): Promise<FreelanceResponseDto> {
    return this.freelanceService.create(data);
  }

  @Get('/juristic/:juristicId')
  @ApiOperation({
    summary: 'Get freelance by juristic ID',
    operationId: 'getFreelanceByJuristicId',
  })
  @ApiParam({
    name: 'juristicId',
    description: 'The juristic ID of the freelance',
  })
  @ApiResponse({
    status: 200,
    description: 'Return the freelance with the specified juristic ID',
    type: FreelanceWithUserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Freelance not found',
    type: NotFoundErrorResponseDto,
  })
  async getByJuristicId(
    @Param('juristicId') juristicId: string,
  ): Promise<FreelanceWithUserResponseDto> {
    return this.freelanceService.getByJuristicId(juristicId);
  }

  @Patch(':freelanceId')
  @ApiOperation({
    summary: 'Update freelance details',
    operationId: 'updateFreelance',
  })
  @ApiParam({
    name: 'freelanceId',
    description: 'The ID of the freelance to update',
  })
  @ApiBody({
    type: UpdateFreelanceDto,
    description: 'Freelance data to update',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The freelance has been successfully updated',
    type: FreelanceResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ValidationErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Freelance not found',
    type: NotFoundErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
    type: UnauthorizedErrorResponseDto,
  })
  async update(
    @Param('freelanceId') freelanceId: string,
    @Body() data: UpdateFreelanceDto,
  ): Promise<FreelanceResponseDto> {
    return this.freelanceService.update(freelanceId, data);
  }
}
