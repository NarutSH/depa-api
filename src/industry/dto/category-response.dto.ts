import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the category',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the category',
    example: 'Mobile Games',
  })
  name: string;

  @ApiProperty({
    description: 'Unique slug identifier for the category',
    example: 'mobile-games',
  })
  slug: string;

  @ApiProperty({
    description: 'Description of the category',
    example: 'Games designed for mobile platforms',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Image URL for the category',
    example: 'https://example.com/mobile-games.jpg',
    required: false,
  })
  image?: string;

  @ApiProperty({
    description: 'Industry slug this category belongs to',
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

export class CategoryListResponseDto {
  @ApiProperty({
    description: 'List of categories',
    type: [CategoryResponseDto],
  })
  data: CategoryResponseDto[];

  @ApiProperty({
    description: 'Total number of categories',
    example: 25,
  })
  total: number;
}
