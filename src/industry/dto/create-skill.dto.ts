import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSkillDto {
  @ApiProperty({ description: 'Skill title', example: 'Game Design' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Skill slug identifier (URL-friendly)',
    example: 'game-design',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    description: 'Optional skill group for categorization',
    required: false,
    example: 'Design',
  })
  @IsString()
  @IsOptional()
  group?: string;

  @ApiProperty({
    description: 'Industry slug that this skill belongs to',
    example: 'game',
  })
  @IsString()
  @IsNotEmpty()
  industrySlug: string;
}
