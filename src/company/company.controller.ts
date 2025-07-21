import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import {
  QueryMetadataDto,
  NotFoundErrorResponseDto,
  UnauthorizedErrorResponseDto,
  ValidationErrorResponseDto,
} from 'src/utils';
import { CompanyService } from './company.service';
import {
  CreateCompanyDto,
  CompanyListResponseDto,
  CompanyResponseDto,
  CompanyWithRevenueResponseDto,
  CompanyWithUserResponseDto,
} from './dto';

@ApiTags('Company')
@ApiBearerAuth()
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all companies with filtering and pagination' })
  @ApiResponse({
    status: 200,
    description: 'Return a paginated list of companies with their details',
    type: CompanyListResponseDto,
  })
  async getCompanies(
    @Query() query: QueryMetadataDto,
  ): Promise<CompanyListResponseDto> {
    return this.companyService.getCompanies(query);
  }

  @Get('all')
  @Public()
  @ApiOperation({ summary: 'Get all companies with optional industry filter' })
  @ApiQuery({
    name: 'industry',
    required: false,
    description: 'Filter companies by industry',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all companies matching the optional industry filter',
    type: [CompanyWithUserResponseDto],
  })
  async getAl(
    @Query('industry') industry: string,
  ): Promise<CompanyWithUserResponseDto[]> {
    return this.companyService.getAl(industry);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get company by user ID' })
  @ApiParam({ name: 'userId', description: 'The user ID of the company' })
  @ApiResponse({
    status: 200,
    description: 'Return the company with the specified user ID',
    type: CompanyResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found',
    type: NotFoundErrorResponseDto,
  })
  async getByUserId(
    @Param('userId') userId: string,
  ): Promise<CompanyResponseDto> {
    return this.companyService.getByUserId(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new company' })
  @ApiResponse({
    status: 201,
    description: 'The company has been successfully created',
    type: CompanyResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed',
    type: ValidationErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedErrorResponseDto,
  })
  async create(@Body() data: CreateCompanyDto): Promise<CompanyResponseDto> {
    return this.companyService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update company details' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the company to update',
  })
  @ApiResponse({
    status: 200,
    description: 'The company has been successfully updated',
    type: CompanyResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed',
    type: ValidationErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found',
    type: NotFoundErrorResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() data: CreateCompanyDto,
  ): Promise<CompanyResponseDto> {
    return this.companyService.update(id, data);
  }

  @Patch('juristic/:juristicId')
  @ApiOperation({ summary: 'Update company by juristic ID' })
  @ApiParam({
    name: 'juristicId',
    description: 'The juristic ID of the company to update',
  })
  @ApiResponse({
    status: 200,
    description: 'The company has been successfully updated',
    type: CompanyResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed',
    type: ValidationErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found',
    type: NotFoundErrorResponseDto,
  })
  async updateByJuristic(
    @Param('juristicId') juristicId: string,
    @Body() data: CreateCompanyDto,
  ): Promise<CompanyResponseDto> {
    return this.companyService.updateByJuristic(juristicId, data);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get company by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the company' })
  @ApiResponse({
    status: 200,
    description: 'Return the company with the specified ID',
    type: CompanyWithUserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found',
    type: NotFoundErrorResponseDto,
  })
  async getById(@Param('id') id: string): Promise<CompanyWithUserResponseDto> {
    return this.companyService.getById(id);
  }

  @Get('juristic/:juristicId')
  @Public()
  @ApiOperation({ summary: 'Get company by juristic ID' })
  @ApiParam({
    name: 'juristicId',
    description: 'The juristic ID of the company',
  })
  @ApiResponse({
    status: 200,
    description: 'Return the company with the specified juristic ID',
    type: CompanyWithRevenueResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found',
    type: NotFoundErrorResponseDto,
  })
  async getByJuristicId(
    @Param('juristicId') juristicId: string,
  ): Promise<CompanyWithRevenueResponseDto> {
    return this.companyService.getByJuristicId(juristicId);
  }
}
