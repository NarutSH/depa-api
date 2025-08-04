import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLookingForDto {
  @ApiProperty({
    description: 'Looking for name',
    example: 'Game Developer',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description:
      'Looking for slug (optional, will be auto-generated if not provided)',
    example: 'game-developer',
    required: false,
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    description: 'Industry slug that this looking for belongs to',
    example: 'technology',
  })
  @IsString()
  @IsNotEmpty()
  industrySlug: string;
}
