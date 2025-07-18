import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { ChannelQueryParams } from './dto/channel-query.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Response } from 'express';
import { Channel } from 'generated/prisma';

@ApiTags('Channel')
@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new channel' })
  @ApiBody({
    type: CreateChannelDto,
    description: 'Channel data to create',
  })
  @ApiResponse({
    status: 201,
    description: 'Channel created successfully',
    schema: {
      allOf: [{ $ref: '#/components/schemas/Channel' }],
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  async create(@Body() createChannelDto: CreateChannelDto): Promise<Channel> {
    return this.channelService.create(createChannelDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all channels with pagination and filtering' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (1-based)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    example: 10,
  })
  @ApiQuery({
    name: 'industry',
    required: false,
    description: 'Filter by industry slug',
    example: 'technology',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    description: 'Sort field and direction (e.g., name:asc, createdAt:desc)',
    example: 'name:asc',
  })
  @ApiResponse({
    status: 200,
    description: 'List of channels retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Channel' },
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            page: { type: 'number' },
            limit: { type: 'number' },
            totalPages: { type: 'number' },
          },
        },
      },
    },
  })
  async findAll(
    @Query() query: ChannelQueryParams,
    @Res() res: Response,
  ): Promise<any> {
    const result = await this.channelService.findAll(query);
    res.set('X-Total-Count', String(result.meta.total));
    res.set('Access-Control-Expose-Headers', 'X-Total-Count');
    return res.json(result.data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get channel by ID' })
  @ApiParam({
    name: 'id',
    description: 'Channel ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Channel found successfully',
    schema: {
      allOf: [{ $ref: '#/components/schemas/Channel' }],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Channel not found',
  })
  async findOne(@Param('id') id: string): Promise<Channel | null> {
    return this.channelService.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update channel by ID' })
  @ApiParam({
    name: 'id',
    description: 'Channel ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateChannelDto,
    description: 'Channel data to update',
  })
  @ApiResponse({
    status: 200,
    description: 'Channel updated successfully',
    schema: {
      allOf: [{ $ref: '#/components/schemas/Channel' }],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Channel not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  async update(
    @Param('id') id: string,
    @Body() updateChannelDto: UpdateChannelDto,
  ): Promise<Channel> {
    return this.channelService.update(id, updateChannelDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete channel by ID' })
  @ApiParam({
    name: 'id',
    description: 'Channel ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Channel deleted successfully',
    schema: {
      allOf: [{ $ref: '#/components/schemas/Channel' }],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Channel not found',
  })
  async remove(@Param('id') id: string): Promise<Channel> {
    return this.channelService.remove(id);
  }
}
