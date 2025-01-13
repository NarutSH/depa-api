import { IsEmail, IsOptional, IsString } from 'class-validator';

class CreateUserDto {
  @IsString()
  fullnameTh: string;

  @IsOptional()
  @IsString()
  fullnameEn?: string;

  @IsOptional()
  @IsString()
  about?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  location?: string;
}

export default CreateUserDto;
