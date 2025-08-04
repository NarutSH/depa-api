import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindSegmentsQueryDto {
  @ApiProperty({
    description: 'Filter by industry slug',
    required: false,
    example: 'game',
  })
  @IsString()
  @IsOptional()
  industrySlug?: string;

  @ApiProperty({
    description: 'Search by name or slug',
    required: false,
    example: 'casual',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: 'Number of records to skip',
    required: false,
    example: 0,
  })
  @IsOptional()
  skip?: number;

  @ApiProperty({
    description: 'Number of records to take',
    required: false,
    example: 10,
  })
  @IsOptional()
  take?: number;
}
