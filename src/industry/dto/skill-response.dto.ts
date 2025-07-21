import { ApiProperty } from '@nestjs/swagger';

export class IndustryDto {
  @ApiProperty({ description: 'Industry name' })
  name: string;

  @ApiProperty({ description: 'Industry slug identifier' })
  slug: string;
}

export class SkillResponseDto {
  @ApiProperty({ description: 'Unique identifier' })
  id: string;

  @ApiProperty({ description: 'Skill title' })
  title: string;

  @ApiProperty({ description: 'Skill slug identifier' })
  slug: string;

  @ApiProperty({ description: 'Optional skill group', required: false })
  group?: string;

  @ApiProperty({ description: 'Associated industry slug' })
  industrySlug: string;

  @ApiProperty({ type: IndustryDto, description: 'Associated industry data' })
  industry?: IndustryDto;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

export class SkillListResponseDto {
  @ApiProperty({
    description: 'Array of skills',
    type: [SkillResponseDto],
  })
  data: SkillResponseDto[];

  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Skills retrieved successfully',
    required: false,
  })
  message?: string;
}
