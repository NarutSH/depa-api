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
import { QueryMetadataDto } from 'src/utils';
import { CompanyService } from './company.service';
import CreateCompanyDto from './dto/create-company.dto';
import {
  GetCompaniesResponse,
  CompanyWithExtendedUser,
  CompanyWithUser,
  CompanyWithRevenue,
} from './dto/company-response.dto';
import { Company } from 'generated/prisma';

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
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            allOf: [
              { $ref: '#/components/schemas/Company' },
              {
                type: 'object',
                properties: {
                  user: { $ref: '#/components/schemas/User' },
                  companyRevenue: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/CompanyRevenue' },
                  },
                },
              },
            ],
          },
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            page: { type: 'number' },
            limit: { type: 'number' },
            totalPages: { type: 'number' },
            hasNext: { type: 'boolean' },
            hasPrevious: { type: 'boolean' },
          },
        },
      },
    },
  })
  async getCompanies(
    @Query() query: QueryMetadataDto,
  ): Promise<GetCompaniesResponse> {
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
    schema: {
      type: 'array',
      items: {
        allOf: [
          { $ref: '#/components/schemas/Company' },
          {
            type: 'object',
            properties: {
              user: {
                allOf: [
                  { $ref: '#/components/schemas/User' },
                  {
                    type: 'object',
                    properties: {
                      industriesRelated: { type: 'array' },
                      industryChannels: { type: 'array' },
                      industrySkills: { type: 'array' },
                      industryTags: { type: 'array' },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    },
  })
  async getAl(
    @Query('industry') industry: string,
  ): Promise<CompanyWithExtendedUser[]> {
    return this.companyService.getAl(industry);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get company by user ID' })
  @ApiParam({ name: 'userId', description: 'The user ID of the company' })
  @ApiResponse({
    status: 200,
    description: 'Return the company with the specified user ID',
    schema: { $ref: '#/components/schemas/Company' },
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found',
  })
  async getByUserId(@Param('userId') userId: string): Promise<Company> {
    return this.companyService.getByUserId(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new company' })
  @ApiResponse({
    status: 201,
    description: 'The company has been successfully created',
    schema: { $ref: '#/components/schemas/Company' },
  })
  async create(@Body() data: CreateCompanyDto): Promise<Company> {
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
    schema: { $ref: '#/components/schemas/Company' },
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found',
  })
  async update(
    @Param('id') id: string,
    @Body() data: CreateCompanyDto,
  ): Promise<Company> {
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
    schema: { $ref: '#/components/schemas/Company' },
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found',
  })
  async updateByJuristic(
    @Param('juristicId') juristicId: string,
    @Body() data: CreateCompanyDto,
  ): Promise<Company> {
    return this.companyService.updateByJuristic(juristicId, data);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get company by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the company' })
  @ApiResponse({
    status: 200,
    description: 'Return the company with the specified ID',
    schema: {
      allOf: [
        { $ref: '#/components/schemas/Company' },
        {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/User' },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found',
  })
  async getById(@Param('id') id: string): Promise<CompanyWithUser> {
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
    schema: {
      allOf: [
        { $ref: '#/components/schemas/Company' },
        {
          type: 'object',
          properties: {
            companyRevenue: {
              type: 'array',
              items: { $ref: '#/components/schemas/CompanyRevenue' },
            },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found',
  })
  async getByJuristicId(
    @Param('juristicId') juristicId: string,
  ): Promise<CompanyWithRevenue> {
    return this.companyService.getByJuristicId(juristicId);
  }
}
