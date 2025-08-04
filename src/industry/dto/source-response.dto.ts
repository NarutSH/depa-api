import { ApiProperty } from '@nestjs/swagger';

export class SourceResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the source',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the source',
    example: 'Steam',
  })
  name: string;

  @ApiProperty({
    description: 'Unique slug identifier for the source',
    example: 'steam',
  })
  slug: string;

  @ApiProperty({
    description: 'Description of the source',
    example: 'Digital distribution platform for games',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Image URL for the source',
    example: 'https://example.com/steam.jpg',
    required: false,
  })
  image?: string;

  @ApiProperty({
    description: 'Industry slug this source belongs to',
    example: 'game',
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

export class SourceListResponseDto {
  @ApiProperty({
    description: 'List of sources',
    type: [SourceResponseDto],
  })
  data: SourceResponseDto[];

  @ApiProperty({
    description: 'Total number of sources',
    example: 25,
  })
  total: number;
}
