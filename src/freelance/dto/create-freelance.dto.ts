import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateFreelanceDto {
  @IsString()
  userId: string;

  @IsString()
  firstNameTh: string;

  @IsString()
  lastNameTh: string;

  @IsString()
  @IsOptional()
  firstNameEn?: string;

  @IsString()
  @IsOptional()
  lastNameEn?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  subDistrict?: string;

  @IsString()
  @IsOptional()
  district?: string;

  @IsString()
  @IsOptional()
  province?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  juristicId?: string;

  @IsOptional()
  @IsString({ each: true })
  industryTypes?: string[];

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  cover_image?: string;
}
