import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSegmentDto {
  @ApiProperty({
    description: 'Name of the segment',
    example: 'Casual Gamers',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Unique slug identifier for the segment',
    example: 'casual-gamers',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    description: 'Description of the segment',
    example: 'Games for casual gaming audience',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Image URL for the segment',
    example: 'https://example.com/casual-gamers.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({
    description: 'Industry slug this segment belongs to',
    example: 'game',
  })
  @IsString()
  @IsNotEmpty()
  industrySlug: string;
}
