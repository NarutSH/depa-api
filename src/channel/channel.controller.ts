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
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { Public } from '../auth/decorators/public.decorator';
import { QueryMetadataDto } from 'src/utils';
import { Response } from 'express';

@ApiTags('Channel')
@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new channel',
    operationId: 'createChannel',
  })
  @ApiBody({ type: CreateChannelDto })
  @ApiResponse({ status: 201, description: 'Channel created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createChannelDto: CreateChannelDto) {
    return this.channelService.create(createChannelDto);
  }

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Get all channels with pagination, filtering, and sorting',
    operationId: 'getChannels',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (1-based)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Sort field and direction',
  })
  @ApiResponse({ status: 200, description: 'List of channels' })
  async findAll(@Query() query: QueryMetadataDto, @Res() res: Response) {
    const result = await this.channelService.findAll(query);
    res.set('X-Total-Count', String(result.meta.total));
    res.set('Access-Control-Expose-Headers', 'X-Total-Count');
    return res.json(result.data);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get channel by ID',
    operationId: 'getChannelById',
  })
  @ApiParam({ name: 'id', description: 'Channel ID' })
  @ApiResponse({ status: 200, description: 'Channel found' })
  @ApiResponse({ status: 404, description: 'Channel not found' })
  async findOne(@Param('id') id: string) {
    return this.channelService.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update channel by ID',
    operationId: 'updateChannel',
  })
  @ApiParam({ name: 'id', description: 'Channel ID' })
  @ApiBody({ type: UpdateChannelDto })
  @ApiResponse({ status: 200, description: 'Channel updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Channel not found' })
  async update(
    @Param('id') id: string,
    @Body() updateChannelDto: UpdateChannelDto,
  ) {
    return this.channelService.update(id, updateChannelDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete channel by ID',
    operationId: 'deleteChannel',
  })
  @ApiParam({ name: 'id', description: 'Channel ID' })
  @ApiResponse({ status: 200, description: 'Channel deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Channel not found' })
  async remove(@Param('id') id: string) {
    return this.channelService.remove(id);
  }
}
