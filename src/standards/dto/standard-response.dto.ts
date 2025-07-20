import { ApiProperty } from '@nestjs/swagger';

export class IndustryDto {
  @ApiProperty({ description: 'Industry name' })
  name: string;

  @ApiProperty({ description: 'Industry slug identifier' })
  slug: string;
}

export class StandardResponseDto {
  @ApiProperty({ description: 'Unique identifier' })
  id: string;

  @ApiProperty({ description: 'Standard name' })
  name: string;

  @ApiProperty({ description: 'Standard type' })
  type: string;

  @ApiProperty({ description: 'Description', required: false })
  description?: string;

  @ApiProperty({ description: 'Image path', required: false })
  image?: string;

  @ApiProperty({ description: 'Industry slug' })
  industrySlug: string;

  @ApiProperty({ type: IndustryDto, description: 'Associated industry data' })
  industry: IndustryDto;
}
