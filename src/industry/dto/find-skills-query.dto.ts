import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FindSkillsQueryDto {
  @ApiProperty({
    description: 'Number of items to skip for pagination',
    required: false,
    example: 0,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  skip?: number;

  @ApiProperty({
    description: 'Number of items to take for pagination',
    required: false,
    example: 10,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  take?: number;

  @ApiProperty({
    description: 'Filter skills by industry slug',
    required: false,
    example: 'game',
  })
  @IsString()
  @IsOptional()
  industrySlug?: string;

  @ApiProperty({
    description: 'Filter skills by group',
    required: false,
    example: 'design',
  })
  @IsString()
  @IsOptional()
  group?: string;
}
