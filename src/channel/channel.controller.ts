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
  @ApiOperation({ summary: 'Create a new channel' })
  @ApiResponse({ status: 201, description: 'Channel created successfully' })
  async create(@Body() createChannelDto: CreateChannelDto) {
    return this.channelService.create(createChannelDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all channels' })
  @ApiResponse({ status: 200, description: 'List of channels' })
  async findAll(@Query() query: QueryMetadataDto, @Res() res: Response) {
    const result = await this.channelService.findAll(query);
    res.set('X-Total-Count', String(result.meta.total));
    res.set('Access-Control-Expose-Headers', 'X-Total-Count');
    return res.json(result.data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get channel by ID' })
  @ApiResponse({ status: 200, description: 'Channel found' })
  @ApiResponse({ status: 404, description: 'Channel not found' })
  async findOne(@Param('id') id: string) {
    return this.channelService.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update channel by ID' })
  @ApiResponse({ status: 200, description: 'Channel updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateChannelDto: UpdateChannelDto,
  ) {
    return this.channelService.update(id, updateChannelDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete channel by ID' })
  @ApiResponse({ status: 200, description: 'Channel deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.channelService.remove(id);
  }
}
