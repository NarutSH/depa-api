import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

class CreateCompanyDto {
  @IsString()
  juristicId: string;

  @IsString()
  nameTh: string;

  @IsOptional()
  @IsString()
  nameEn?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  address: string;

  @IsString()
  subDistrict: string;

  @IsString()
  district: string;

  @IsString()
  province: string;

  @IsString()
  postalCode: string;

  @IsNumber()
  registerdCapital: number;

  @IsNumber()
  employeeCount: number;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsString()
  userId: string;
}

export default CreateCompanyDto;
