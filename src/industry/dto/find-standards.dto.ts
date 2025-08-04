import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { StandardsType } from '../../../generated/prisma';

export class FindStandardsDto {
  @ApiPropertyOptional({
    description: 'Industry slug to filter standards',
    example: 'technology',
  })
  @IsString()
  @IsOptional()
  industrySlug?: string;

  @ApiPropertyOptional({
    description: 'Standards name to search for',
    example: 'ESRB',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Standards type to filter by',
    example: 'ESRB',
    enum: StandardsType,
  })
  @IsEnum(StandardsType)
  @IsOptional()
  type?: StandardsType;
}
