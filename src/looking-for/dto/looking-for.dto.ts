import { IsString, IsOptional } from 'class-validator';

export class CreateLookingForDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  industrySlug: string;
}

export class UpdateLookingForDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  industrySlug?: string;
}
