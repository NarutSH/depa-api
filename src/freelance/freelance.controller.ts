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

@ApiTags('Freelance')
@ApiBearerAuth()
@Controller('freelance')
export class FreelanceController {
  constructor(private readonly freelanceService: FreelanceService) {}

  @Get()
  @ApiOperation({ summary: 'Get all freelances with filtering and pagination' })
  @ApiResponse({
    status: 200,
    description: 'Return a paginated list of freelances with their details',
  })
  async getFreelances(@Query() query: QueryMetadataDto) {
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
  })
  async getAl(@Query('industry') industry: string) {
    return this.freelanceService.getAl(industry);
  }

  @Get('/user/:userId')
  @ApiOperation({ summary: 'Get freelance by user ID' })
  @ApiParam({ name: 'userId', description: 'The user ID of the freelance' })
  @ApiResponse({
    status: 200,
    description: 'Return the freelance with the specified user ID',
  })
  @ApiResponse({
    status: 404,
    description: 'Freelance not found',
  })
  async getByUserId(@Param('userId') userId: string) {
    return this.freelanceService.getByUserId(userId);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get freelance by user ID' })
  @ApiParam({ name: 'userId', description: 'The user ID of the freelance' })
  @ApiResponse({
    status: 200,
    description: 'Return the freelance with the specified user ID',
  })
  @ApiResponse({
    status: 404,
    description: 'Freelance not found',
  })
  async getById(@Param('id') id: string) {
    return this.freelanceService.getById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new freelance' })
  @ApiResponse({
    status: 201,
    description: 'The freelance has been successfully created',
  })
  async create(@Body() data: CreateFreelanceDto) {
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
  })
  @ApiResponse({
    status: 404,
    description: 'Freelance not found',
  })
  async getByJuristicId(@Param('juristicId') juristicId: string) {
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
  })
  @ApiResponse({
    status: 404,
    description: 'Freelance not found',
  })
  async update(
    @Param('freelanceId') freelanceId: string,
    @Body() data: Partial<CreateFreelanceDto>,
  ) {
    return this.freelanceService.update(freelanceId, data);
  }
}
