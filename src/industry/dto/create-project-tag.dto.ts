import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectTagDto {
  @ApiProperty({
    description: 'Project tag name',
    example: 'Gaming',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description:
      'Project tag slug (optional, will be auto-generated if not provided)',
    example: 'gaming',
    required: false,
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    description: 'Industry slug that this project tag belongs to',
    example: 'technology',
  })
  @IsString()
  @IsNotEmpty()
  industrySlug: string;
}
