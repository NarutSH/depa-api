import { ApiProperty } from '@nestjs/swagger';

export class IndustryResponseDto {
  @ApiProperty({
    description: 'Industry unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Industry name',
    example: 'Game Development',
  })
  name: string;

  @ApiProperty({
    description: 'Industry slug (URL friendly identifier)',
    example: 'game-development',
  })
  slug: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2025-05-11T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2025-05-11T10:30:00Z',
  })
  updatedAt: Date;
}
