import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min, Max } from 'class-validator';

export class ClearRevenueTableDto {
  @ApiProperty({ description: 'ปีของรายได้', example: 2024 })
  @IsNumber()
  @Min(2000)
  @Max(3000)
  year: number;

  @ApiProperty({ description: 'Source Slug', example: 'ip-owner' })
  @IsString()
  sourceSlug: string;

  @ApiProperty({ description: 'Company ID', example: 'uuid-string' })
  @IsString()
  companyId: string;
} 