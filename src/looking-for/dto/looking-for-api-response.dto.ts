import { ApiProperty } from '@nestjs/swagger';

export class LookingForResponse {
  @ApiProperty({
    description: 'Unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the looking for category',
    example: 'Web Development',
  })
  name: string;

  @ApiProperty({
    description: 'Unique slug for the looking for category',
    example: 'web-development',
  })
  slug: string;

  @ApiProperty({
    description: 'Industry slug this looking for belongs to',
    example: 'technology',
  })
  industrySlug: string;

  @ApiProperty({
    description: 'Description of the looking for category',
    example: 'Services related to web development and programming',
    required: false,
  })
  description?: string;

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

export class GetLookingForListResponse {
  @ApiProperty({
    description: 'List of looking for categories',
    type: () => [LookingForResponse],
  })
  data: LookingForResponse[];
}

export class GetLookingForResponse {
  @ApiProperty({
    description: 'Looking for category details',
    type: LookingForResponse,
  })
  data: LookingForResponse;
}

export class CreateLookingForResponse {
  @ApiProperty({
    description: 'Created looking for category',
    type: LookingForResponse,
  })
  data: LookingForResponse;
}

export class UpdateLookingForResponse {
  @ApiProperty({
    description: 'Updated looking for category',
    type: LookingForResponse,
  })
  data: LookingForResponse;
}

export class DeleteLookingForResponse {
  @ApiProperty({
    description: 'Deleted looking for category',
    type: LookingForResponse,
  })
  data: LookingForResponse;
}
