import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindLookingForDto {
  @ApiPropertyOptional({
    description: 'Industry slug to filter looking for items',
    example: 'technology',
  })
  @IsString()
  @IsOptional()
  industrySlug?: string;

  @ApiPropertyOptional({
    description: 'Looking for name to search for',
    example: 'Developer',
  })
  @IsString()
  @IsOptional()
  name?: string;
}
