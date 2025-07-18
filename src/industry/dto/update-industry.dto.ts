import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateIndustryDto {
  @ApiProperty({
    description: 'Updated industry name',
    example: 'Information Technology & Services',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Updated industry slug',
    example: 'information-technology-services',
    required: false,
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    description: 'Updated color code for the industry',
    example: '#2980b9',
    required: false,
  })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({
    description: 'Updated description of the industry',
    example:
      'Comprehensive technology sector including software development, IT services, digital solutions, and emerging technologies',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Updated image URL for the industry',
    example: 'https://example.com/updated-industry-image.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  image?: string;
}
