import { ApiProperty } from '@nestjs/swagger';

export class IndustryDto {
  @ApiProperty({ description: 'Industry name' })
  name: string;

  @ApiProperty({ description: 'Industry slug identifier' })
  slug: string;
}

export class TagResponseDto {
  @ApiProperty({ description: 'Unique identifier' })
  id: string;

  @ApiProperty({ description: 'Tag name' })
  name: string;

  @ApiProperty({ description: 'Tag slug identifier' })
  slug: string;

  @ApiProperty({ description: 'Associated industry slug' })
  industrySlug: string;

  @ApiProperty({ type: IndustryDto, description: 'Associated industry data' })
  industry?: IndustryDto;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

export class TagListResponseDto {
  @ApiProperty({
    description: 'Array of tags',
    type: [TagResponseDto],
  })
  data: TagResponseDto[];

  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Tags retrieved successfully',
    required: false,
  })
  message?: string;
}
