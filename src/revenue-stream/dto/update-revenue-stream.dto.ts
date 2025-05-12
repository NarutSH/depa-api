import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateRevenueStreamDto {
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
  @IsNumber()
  value?: number;

  @IsOptional()
  @IsString()
  companyJuristicId?: string;

  @IsOptional()
  @IsString()
  companyRevenueId?: string;
}
