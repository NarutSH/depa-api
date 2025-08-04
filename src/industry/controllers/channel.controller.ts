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
import { CreateChannelDto } from '../dto/create-channel.dto';
import { UpdateChannelDto } from '../dto/update-channel.dto';
import { FindChannelsQueryDto } from '../dto/find-channels-query.dto';
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
  ChannelResponseDto,
  ChannelListResponseDto,
} from '../dto/channel-response.dto';
import {
  ValidationErrorResponseDto,
  NotFoundErrorResponseDto,
  UnauthorizedErrorResponseDto,
} from 'src/utils/dtos/error-response.dto';

@ApiTags('Industry - Channels')
@ApiBearerAuth()
@Controller('industry/channels')
export class ChannelController {
  constructor(private readonly industryService: IndustryService) {}

  @ApiOperation({
    summary: 'Create a new channel',
    operationId: 'createChannel',
  })
  @ApiBody({
    type: CreateChannelDto,
    description: 'Channel data to create',
    required: true,
  })
  @ApiCreatedResponse({
    description: 'The channel has been successfully created',
    type: ChannelResponseDto,
  })
  @Post()
  createChannel(@Body() createChannelDto: CreateChannelDto) {
    return this.industryService.createChannel(createChannelDto);
  }

  @ApiOperation({
    summary: 'Get all channels with optional filtering',
    operationId: 'findAllChannels',
  })
  @ApiOkResponse({
    description: 'List of channels matching the query criteria',
    type: ChannelListResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ValidationErrorResponseDto,
  })
  @Get('all')
  findAllChannels(
    @Query() query: FindChannelsQueryDto,
  ): Promise<ChannelListResponseDto> {
    return this.industryService.findAllChannels(query);
  }

  @ApiOperation({
    summary: 'Get a channel by its slug',
    operationId: 'findChannelBySlug',
  })
  @ApiParam({ name: 'slug', description: 'Channel slug identifier' })
  @ApiQuery({
    name: 'industrySlug',
    required: false,
    description: 'Optional industry slug to filter by',
  })
  @ApiOkResponse({
    description: 'The channel data',
    type: ChannelResponseDto,
  })
  @Get(':slug')
  findChannelBySlug(
    @Param('slug') slug: string,
    @Query('industrySlug') industrySlug?: string,
  ) {
    return this.industryService.findChannelBySlug(slug, industrySlug);
  }

  @ApiOperation({
    summary: 'Update an existing channel',
    operationId: 'updateChannel',
  })
  @ApiBody({
    type: UpdateChannelDto,
    description: 'Channel data to update',
    required: true,
  })
  @ApiParam({ name: 'slug', description: 'Channel slug identifier to update' })
  @ApiOkResponse({
    description: 'The channel has been successfully updated',
    type: ChannelResponseDto,
  })
  @Put(':slug')
  updateChannel(
    @Param('slug') slug: string,
    @Body() updateChannelDto: UpdateChannelDto,
  ) {
    return this.industryService.updateChannel(slug, updateChannelDto);
  }

  @ApiOperation({
    summary: 'Delete a channel',
    operationId: 'deleteChannel',
  })
  @ApiParam({ name: 'slug', description: 'Channel slug identifier to delete' })
  @ApiOkResponse({
    description: 'The channel has been successfully deleted',
    type: ChannelResponseDto,
  })
  @Delete(':slug')
  deleteChannel(@Param('slug') slug: string) {
    return this.industryService.deleteChannel(slug);
  }
}
