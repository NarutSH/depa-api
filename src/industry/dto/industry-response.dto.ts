import { ApiProperty } from '@nestjs/swagger';
import { SkillResponseDto } from './skill-response.dto';
import { TagResponseDto } from './tag-response.dto';
import { ChannelResponseDto } from './channel-response.dto';

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
    description: 'Industry description',
    example: 'Comprehensive game development services',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Industry image URL',
    example: 'https://example.com/industry-image.jpg',
    required: false,
  })
  image?: string;

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

export class IndustryWithRelationsResponseDto extends IndustryResponseDto {
  @ApiProperty({
    description: 'Associated skills',
    type: [SkillResponseDto],
    required: false,
  })
  skills?: SkillResponseDto[];

  @ApiProperty({
    description: 'Associated tags',
    type: [TagResponseDto],
    required: false,
  })
  tags?: TagResponseDto[];

  @ApiProperty({
    description: 'Associated channels',
    type: [ChannelResponseDto],
    required: false,
  })
  channels?: ChannelResponseDto[];
}

export class IndustryListResponseDto {
  @ApiProperty({
    description: 'Array of industries',
    type: [IndustryWithRelationsResponseDto],
  })
  data: IndustryWithRelationsResponseDto[];

  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Industries retrieved successfully',
    required: false,
  })
  message?: string;
}
