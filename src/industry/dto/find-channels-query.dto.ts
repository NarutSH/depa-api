import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FindChannelsQueryDto {
  @ApiProperty({
    description: 'Number of items to skip for pagination',
    required: false,
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
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  take?: number;

  @ApiProperty({
    description: 'Filter channels by industry slug',
    required: false,
    example: 'game',
  })
  @IsString()
  @IsOptional()
  industrySlug?: string;
}
