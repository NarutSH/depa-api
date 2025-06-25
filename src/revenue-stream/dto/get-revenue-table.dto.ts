import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min, Max, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetRevenueTableDto {
  @ApiProperty({ description: 'ปีของรายได้', example: 2024 })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(2000)
  @Max(3000)
  year: number;

  @ApiProperty({ description: 'Company ID', example: 'uuid-string' })
  @IsString()
  companyId: string;

  @ApiProperty({ description: 'Industry Type Slug (optional)', example: 'game', required: false })
  @IsOptional()
  @IsString()
  industryTypeSlug?: string;

  @ApiProperty({ description: 'Source Slug (optional)', example: 'ip-owner', required: false })
  @IsOptional()
  @IsString()
  sourceSlug?: string;
} 