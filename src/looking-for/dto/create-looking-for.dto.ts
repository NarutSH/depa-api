import { IsString, IsOptional } from 'class-validator';

export class CreateLookingForDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  industrySlug: string;

  @IsOptional()
  @IsString()
  description?: string;
}
