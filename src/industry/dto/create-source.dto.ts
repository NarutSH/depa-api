import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSourceDto {
  @ApiProperty({
    description: 'Name of the source',
    example: 'Steam',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Unique slug identifier for the source',
    example: 'steam',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    description: 'Description of the source',
    example: 'Digital distribution platform for games',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Image URL for the source',
    example: 'https://example.com/steam.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({
    description: 'Industry slug this source belongs to',
    example: 'game',
  })
  @IsString()
  @IsNotEmpty()
  industrySlug: string;
}
