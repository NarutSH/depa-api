import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSkillDto {
  @ApiProperty({
    description: 'Updated skill title',
    required: false,
    example: 'Advanced Game Design',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Updated skill group',
    required: false,
    example: 'Design',
  })
  @IsString()
  @IsOptional()
  group?: string;

  @ApiProperty({
    description: 'New slug for the skill (if you want to change it)',
    required: false,
    example: 'advanced-game-design',
  })
  @IsString()
  @IsOptional()
  newSlug?: string;
}
