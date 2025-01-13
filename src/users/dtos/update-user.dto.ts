import { IsOptional, IsString } from 'class-validator';

class UpdateUserDto {
  @IsString()
  @IsOptional()
  fullnameTh?: string;

  @IsOptional()
  @IsString()
  fullnameEn?: string;

  @IsOptional()
  @IsString()
  about?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  location?: string;
}

export default UpdateUserDto;
