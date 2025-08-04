import { ApiProperty } from '@nestjs/swagger';

export class SegmentResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the segment',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the segment',
    example: 'Casual Gamers',
  })
  name: string;

  @ApiProperty({
    description: 'Unique slug identifier for the segment',
    example: 'casual-gamers',
  })
  slug: string;

  @ApiProperty({
    description: 'Description of the segment',
    example: 'Games for casual gaming audience',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Image URL for the segment',
    example: 'https://example.com/casual-gamers.jpg',
    required: false,
  })
  image?: string;

  @ApiProperty({
    description: 'Industry slug this segment belongs to',
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

export class SegmentListResponseDto {
  @ApiProperty({
    description: 'List of segments',
    type: [SegmentResponseDto],
  })
  data: SegmentResponseDto[];

  @ApiProperty({
    description: 'Total number of segments',
    example: 25,
  })
  total: number;
}
