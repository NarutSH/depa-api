import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIndustryDto {
  @ApiProperty({
    description: 'Industry name',
    example: 'Information Technology',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Industry slug (URL friendly identifier)',
    example: 'information-technology',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    description: 'Color code associated with the industry',
    example: '#3498db',
    required: false,
  })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({
    description: 'Description of the industry',
    example:
      'Technology sector including software development, IT services, and digital solutions',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Image URL for the industry',
    example: 'https://example.com/industry-image.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  image?: string;
}
