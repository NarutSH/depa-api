import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLookingForDto {
  @ApiProperty({
    description: 'Name of the looking for category',
    example: 'Web Development',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Unique slug for the looking for category',
    example: 'web-development',
  })
  @IsString()
  slug: string;

  @ApiProperty({
    description: 'Industry slug this looking for belongs to',
    example: 'technology',
  })
  @IsString()
  industrySlug: string;

  @ApiProperty({
    description: 'Optional description of the looking for category',
    example: 'Services related to web development and programming',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
