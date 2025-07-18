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
import {
  GetFreelancesResponse,
  FreelanceWithExtendedUser,
  FreelanceWithUser,
} from './dto/freelance-response.dto';
import { Freelance } from 'generated/prisma';

@ApiTags('Freelance')
@ApiBearerAuth()
@Controller('freelance')
export class FreelanceController {
  constructor(private readonly freelanceService: FreelanceService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all freelances with filtering and pagination' })
  @ApiResponse({
    status: 200,
    description: 'Return a paginated list of freelances with their details',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            allOf: [
              { $ref: '#/components/schemas/Freelance' },
              {
                type: 'object',
                properties: {
                  user: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      fullnameTh: { type: 'string' },
                      fullnameEn: { type: 'string' },
                      email: { type: 'string' },
                      image: { type: 'string' },
                      tags: { type: 'object' },
                      industryTags: { type: 'array' },
                      industrySkills: { type: 'array' },
                    },
                  },
                  Portfolio: { type: 'array' },
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
        message: { type: 'string' },
      },
    },
  })
  async getFreelances(
    @Query() query: QueryMetadataDto,
  ): Promise<GetFreelancesResponse> {
    return this.freelanceService.getFreelances(query);
  }

  @Get('all')
  @Public()
  @ApiOperation({ summary: 'Get all freelances with optional industry filter' })
  @ApiQuery({
    name: 'industry',
    required: false,
    description: 'Filter freelances by industry',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all freelances matching the optional industry filter',
    schema: {
      type: 'array',
      items: {
        allOf: [
          { $ref: '#/components/schemas/Freelance' },
          {
            type: 'object',
            properties: {
              user: {
                allOf: [
                  { $ref: '#/components/schemas/User' },
                  {
                    type: 'object',
                    properties: {
                      industrySkills: { type: 'array' },
                      industriesRelated: { type: 'array' },
                      industryChannels: { type: 'array' },
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
  ): Promise<FreelanceWithExtendedUser[]> {
    return this.freelanceService.getAl(industry);
  }

  @Get('/user/:userId')
  @ApiOperation({ summary: 'Get freelance by user ID' })
  @ApiParam({ name: 'userId', description: 'The user ID of the freelance' })
  @ApiResponse({
    status: 200,
    description: 'Return the freelance with the specified user ID',
    schema: { $ref: '#/components/schemas/Freelance' },
  })
  @ApiResponse({
    status: 404,
    description: 'Freelance not found',
  })
  async getByUserId(@Param('userId') userId: string): Promise<Freelance> {
    return this.freelanceService.getByUserId(userId);
  }

  @Get('/:id')
  @Public()
  @ApiOperation({ summary: 'Get freelance by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the freelance' })
  @ApiResponse({
    status: 200,
    description: 'Return the freelance with the specified ID',
    schema: {
      allOf: [
        { $ref: '#/components/schemas/Freelance' },
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
    description: 'Freelance not found',
  })
  async getById(@Param('id') id: string): Promise<FreelanceWithUser> {
    return this.freelanceService.getById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new freelance' })
  @ApiResponse({
    status: 201,
    description: 'The freelance has been successfully created',
    schema: { $ref: '#/components/schemas/Freelance' },
  })
  async create(@Body() data: CreateFreelanceDto): Promise<Freelance> {
    return this.freelanceService.create(data);
  }

  @Get('/juristic/:juristicId')
  @ApiOperation({ summary: 'Get freelance by juristic ID' })
  @ApiParam({
    name: 'juristicId',
    description: 'The juristic ID of the freelance',
  })
  @ApiResponse({
    status: 200,
    description: 'Return the freelance with the specified juristic ID',
    schema: { $ref: '#/components/schemas/Freelance' },
  })
  @ApiResponse({
    status: 404,
    description: 'Freelance not found',
  })
  async getByJuristicId(
    @Param('juristicId') juristicId: string,
  ): Promise<Freelance> {
    return this.freelanceService.getByJuristicId(juristicId);
  }

  @Patch(':freelanceId')
  @ApiOperation({ summary: 'Update freelance details' })
  @ApiParam({
    name: 'freelanceId',
    description: 'The ID of the freelance to update',
  })
  @ApiResponse({
    status: 200,
    description: 'The freelance has been successfully updated',
    schema: { $ref: '#/components/schemas/Freelance' },
  })
  @ApiResponse({
    status: 404,
    description: 'Freelance not found',
  })
  async update(
    @Param('freelanceId') freelanceId: string,
    @Body() data: Partial<CreateFreelanceDto>,
  ): Promise<Freelance> {
    return this.freelanceService.update(freelanceId, data);
  }
}
