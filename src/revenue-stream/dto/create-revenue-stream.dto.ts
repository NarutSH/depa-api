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
  segmentSlug: string;

  @IsString()
  channelSlug: string;

  @IsNumber()
  percent: number;

  @IsNumber()
  ctrPercent: number;

  @IsOptional()
  @IsNumber()
  value?: number;

  @IsString()
  @IsNotEmpty()
  companyJuristicId: string;

  @IsOptional()
  @IsString()
  companyId?: string; // Optional as it's typically derived from companyJuristicId
}
