import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRevenueStreamDto {
  @IsNotEmpty()
  year: number;

  @IsString()
  industryTypeSlug: string;

  @IsString()
  categorySlug: string;

  @IsString()
  sourceSlug: string;

  @IsString()
  segment: string;

  @IsString()
  channelSlug: string;

  @IsNumber()
  percent: number;

  @IsNumber()
  ctrPercent: number;

  @IsOptional()
  value?: number;

  @IsString()
  companyId: string;

  @IsOptional()
  companyRevenueId?: string;
}
