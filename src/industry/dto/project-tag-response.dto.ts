import { ApiProperty } from '@nestjs/swagger';

export class ProjectTagResponseDto {
  @ApiProperty({
    description: 'Project tag unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Project tag name',
    example: 'Gaming',
  })
  name: string;

  @ApiProperty({
    description: 'Project tag slug',
    example: 'gaming',
  })
  slug: string;

  @ApiProperty({
    description: 'Industry slug that this project tag belongs to',
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
