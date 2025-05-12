import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateRevenueValueDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsNumber()
  value: number;

  // The following fields are optional for initial lookups but required for creation
  @IsOptional()
  @IsNumber()
  year?: number;

  @IsOptional()
  @IsString()
  industryTypeSlug?: string;

  @IsOptional()
  @IsString()
  categorySlug?: string;

  @IsOptional()
  @IsString()
  sourceSlug?: string;

  @IsOptional()
  @IsString()
  segmentSlug?: string;

  @IsOptional()
  @IsString()
  channelSlug?: string;

  @IsOptional()
  @IsNumber()
  percent?: number;

  @IsOptional()
  @IsNumber()
  ctrPercent?: number;

  @IsOptional()
  @IsString()
  companyJuristicId?: string;
}
