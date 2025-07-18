import { ApiProperty } from '@nestjs/swagger';

export class ChannelResponse {
  @ApiProperty({
    description: 'Unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the channel',
    example: 'Mobile Development',
  })
  name: string;

  @ApiProperty({
    description: 'Unique slug for the channel',
    example: 'mobile-development',
  })
  slug: string;

  @ApiProperty({
    description: 'Description of the channel',
    example: 'Mobile app development and related services',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Image URL for the channel',
    example: 'https://example.com/images/mobile-dev.jpg',
    required: false,
  })
  image?: string;

  @ApiProperty({
    description: 'Industry slug this channel belongs to',
    example: 'technology',
  })
  industrySlug: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}

export class PaginationMeta {
  @ApiProperty({
    description: 'Total number of items',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 10,
  })
  totalPages: number;
}

export class GetChannelsResponse {
  @ApiProperty({
    description: 'Array of channels',
    type: () => [ChannelResponse],
  })
  data: ChannelResponse[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationMeta,
  })
  meta: PaginationMeta;
}

export class GetChannelResponse {
  @ApiProperty({
    description: 'Channel details',
    type: ChannelResponse,
  })
  data: ChannelResponse;
}

export class CreateChannelResponse {
  @ApiProperty({
    description: 'Created channel',
    type: ChannelResponse,
  })
  data: ChannelResponse;
}

export class UpdateChannelResponse {
  @ApiProperty({
    description: 'Updated channel',
    type: ChannelResponse,
  })
  data: ChannelResponse;
}

export class DeleteChannelResponse {
  @ApiProperty({
    description: 'Deleted channel',
    type: ChannelResponse,
  })
  data: ChannelResponse;
}
