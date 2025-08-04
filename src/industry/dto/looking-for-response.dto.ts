import { ApiProperty } from '@nestjs/swagger';

export class LookingForResponseDto {
  @ApiProperty({
    description: 'Looking for unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Looking for name',
    example: 'Game Developer',
  })
  name: string;

  @ApiProperty({
    description: 'Looking for slug',
    example: 'game-developer',
  })
  slug: string;

  @ApiProperty({
    description: 'Industry slug that this looking for belongs to',
    example: 'technology',
  })
  industrySlug: string;

  @ApiProperty({
    description: 'Created timestamp',
    example: '2024-01-01T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Updated timestamp',
    example: '2024-01-01T00:00:00Z',
  })
  updatedAt: Date;
}
