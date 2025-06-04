import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import CreateCompanyDto from './dto/create-company.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { QueryMetadataDto } from 'src/utils';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('Company')
@ApiBearerAuth()
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  @ApiOperation({ summary: 'Get all companies with filtering and pagination' })
  @ApiResponse({
    status: 200,
    description: 'Return a paginated list of companies with their details',
  })
  async getCompanies(@Query() query: QueryMetadataDto) {
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
  })
  async getAl(@Query('industry') industry: string) {
    return this.companyService.getAl(industry);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get company by user ID' })
  @ApiParam({ name: 'userId', description: 'The user ID of the company' })
  @ApiResponse({
    status: 200,
    description: 'Return the company with the specified user ID',
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found',
  })
  async getByUserId(@Param('userId') userId: string) {
    return this.companyService.getByUserId(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new company' })
  @ApiResponse({
    status: 201,
    description: 'The company has been successfully created',
  })
  async create(@Body() data: CreateCompanyDto) {
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
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found',
  })
  async update(@Param('id') id: string, @Body() data: CreateCompanyDto) {
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
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found',
  })
  async updateByJuristic(
    @Param('juristicId') juristicId: string,
    @Body() data: CreateCompanyDto,
  ) {
    return this.companyService.updateByJuristic(juristicId, data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get company by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the company' })
  @ApiResponse({
    status: 200,
    description: 'Return the company with the specified ID',
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found',
  })
  async getById(@Param('id') id: string) {
    return this.companyService.getById(id);
  }

  @Get('juristic/:juristicId')
  @ApiOperation({ summary: 'Get company by juristic ID' })
  @ApiParam({
    name: 'juristicId',
    description: 'The juristic ID of the company',
  })
  @ApiResponse({
    status: 200,
    description: 'Return the company with the specified juristic ID',
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found',
  })
  async getByJuristicId(@Param('juristicId') juristicId: string) {
    return this.companyService.getByJuristicId(juristicId);
  }
}
