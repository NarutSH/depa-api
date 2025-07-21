import { ApiProperty } from '@nestjs/swagger';

export class IndustryDto {
  @ApiProperty({ description: 'Industry name' })
  name: string;

  @ApiProperty({ description: 'Industry slug identifier' })
  slug: string;
}

export class ChannelResponseDto {
  @ApiProperty({ description: 'Unique identifier' })
  id: string;

  @ApiProperty({ description: 'Channel name' })
  name: string;

  @ApiProperty({ description: 'Channel slug identifier' })
  slug: string;

  @ApiProperty({ description: 'Associated industry slug' })
  industrySlug: string;

  @ApiProperty({ type: IndustryDto, description: 'Associated industry data' })
  industry?: IndustryDto;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

export class ChannelListResponseDto {
  @ApiProperty({
    description: 'Array of channels',
    type: [ChannelResponseDto],
  })
  data: ChannelResponseDto[];

  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Channels retrieved successfully',
    required: false,
  })
  message?: string;
}
