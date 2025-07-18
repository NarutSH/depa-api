import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FindTagsQueryDto {
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
    description: 'Filter tags by industry slug',
    required: false,
    example: 'information-technology',
  })
  @IsString()
  @IsOptional()
  industrySlug?: string;

  @ApiProperty({
    description: 'Search tags by name (case-insensitive)',
    required: false,
    example: 'programming',
  })
  @IsString()
  @IsOptional()
  search?: string;
}
