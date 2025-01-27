import {
  IsArray,
  IsInstance,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreatePortfolioDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  industryTypeSlug: string;

  @IsUrl()
  @IsOptional()
  link?: string;

  @IsString()
  @IsOptional()
  freelanceId?: string;

  @IsString()
  @IsOptional()
  companyJuristicId?: string;

  // @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tags?: string[];

  // @IsArray()
  @IsOptional()
  looking_for: string[];
}

export class CreatePortfolioWithImagesAndStandardsDto extends CreatePortfolioDto {
  @IsArray()
  standards: string[];

  //   @IsArray()
  //   @IsInstance(File, { each: true })
  //   images: Express.Multer.File[];
}
