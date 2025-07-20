import { IsOptional, IsString, IsEnum } from 'class-validator';
import { StandardsType } from 'generated/prisma';

export class CreateStandardDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(StandardsType)
  type: StandardsType;

  @IsString()
  industrySlug: string;

  @IsString()
  @IsOptional()
  image?: string;
}

export class UpdateStandardDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(StandardsType)
  @IsOptional()
  type?: StandardsType;

  @IsString()
  @IsOptional()
  industrySlug?: string;

  @IsString()
  @IsOptional()
  image?: string;
}
