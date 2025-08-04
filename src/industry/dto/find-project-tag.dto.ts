import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindProjectTagDto {
  @ApiPropertyOptional({
    description: 'Industry slug to filter project tags',
    example: 'technology',
  })
  @IsString()
  @IsOptional()
  industrySlug?: string;

  @ApiPropertyOptional({
    description: 'Project tag name to search for',
    example: 'Gaming',
  })
  @IsString()
  @IsOptional()
  name?: string;
}
