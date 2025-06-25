import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, ValidateNested, Min, Max, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class RevenueStreamCellDto {
  @ApiProperty({ description: 'Category Slug', example: 'console-handheld' })
  @IsString()
  categorySlug: string;

  @ApiProperty({ description: 'Segment Slug', example: 'download-and-retail' })
  @IsString()
  segmentSlug: string;

  @ApiProperty({ description: 'Channel Slug', example: 'local' })
  @IsString()
  channelSlug: string;

  @ApiProperty({ description: 'เปอร์เซ็นต์ของ cell นี้', example: 25.5 })
  @IsNumber()
  @Min(0)
  @Max(100)
  percent: number;

  @ApiProperty({ description: 'เปอร์เซ็นต์รวมของ row', example: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  ctrPercent: number;

  @ApiProperty({ description: 'มูลค่าเงิน (optional)', example: 1000000, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  value?: number;
}

export class UpsertRevenueTableDto {
  @ApiProperty({ description: 'ปีของรายได้', example: 2024 })
  @IsNumber()
  @Min(2000)
  @Max(3000)
  year: number;

  @ApiProperty({ description: 'Industry Type Slug', example: 'game' })
  @IsString()
  industryTypeSlug: string;

  @ApiProperty({ description: 'Source Slug', example: 'ip-owner' })
  @IsString()
  sourceSlug: string;

  @ApiProperty({ description: 'Company ID', example: 'uuid-string' })
  @IsString()
  companyId: string;

  @ApiProperty({ description: 'Company Juristic ID', example: '1234567890123' })
  @IsString()
  companyJuristicId: string;

  @ApiProperty({ 
    description: 'ข้อมูลตารางทั้งหมด',
    type: [RevenueStreamCellDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RevenueStreamCellDto)
  tableData: RevenueStreamCellDto[];
} 