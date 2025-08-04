import { ApiProperty } from '@nestjs/swagger';
import { StandardsType } from '../../../generated/prisma';

export class StandardsResponseDto {
  @ApiProperty({
    description: 'Standards unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Standards name',
    example: 'ESRB Mature',
  })
  name: string;

  @ApiProperty({
    description: 'Standards description',
    example: 'Entertainment Software Rating Board - Mature 17+',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Standards type',
    example: 'ESRB',
    enum: StandardsType,
  })
  type: StandardsType;

  @ApiProperty({
    description: 'Industry slug that this standards belongs to',
    example: 'technology',
  })
  industrySlug: string;

  @ApiProperty({
    description: 'Standards image URL',
    example: 'https://example.com/esrb-mature.png',
    required: false,
  })
  image?: string;

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
