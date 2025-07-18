import { ApiProperty } from '@nestjs/swagger';
import { StandardsType } from 'generated/prisma';

export class IndustryDto {
  @ApiProperty({
    description: 'Industry name',
    example: 'Information Technology',
  })
  name: string;

  @ApiProperty({
    description: 'Industry slug identifier',
    example: 'information-technology',
  })
  slug: string;
}

export class StandardResponseDto {
  @ApiProperty({
    description: 'Unique identifier',
    example: 'standard-123-uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Standard name',
    example: 'ISO 27001 Information Security Management',
  })
  name: string;

  @ApiProperty({
    description: 'Type of standard',
    enum: StandardsType,
    example: 'CERTIFICATION',
    enumName: 'StandardsType',
  })
  type: StandardsType;

  @ApiProperty({
    description: 'Detailed description of the standard',
    example:
      'International standard for information security management systems',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Image path for the standard',
    example: '/uploads/standards/iso-27001.png',
    required: false,
  })
  image?: string;

  @ApiProperty({
    description: 'Industry slug this standard belongs to',
    example: 'information-technology',
  })
  industrySlug: string;

  @ApiProperty({
    description: 'Associated industry data',
    type: IndustryDto,
  })
  industry: IndustryDto;
}

export class StandardsListApiResponse {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Standards retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'List of standards',
    type: () => [StandardResponseDto],
  })
  data: StandardResponseDto[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: 'object',
    properties: {
      total: { type: 'number', example: 50 },
      page: { type: 'number', example: 1 },
      limit: { type: 'number', example: 10 },
      totalPages: { type: 'number', example: 5 },
    },
  })
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class StandardApiResponse {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Standard retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Standard data',
    type: StandardResponseDto,
  })
  data: StandardResponseDto;
}

export class StandardDeleteApiResponse {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Standard deleted successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Deleted data (always null)',
    example: null,
  })
  data: null;
}
