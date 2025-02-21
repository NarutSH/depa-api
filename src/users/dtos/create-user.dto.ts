import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  IsJSON,
} from 'class-validator';

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

  @IsArray()
  industries: string[];

  @IsArray()
  @IsOptional()
  tags?: Array<{
    category: string;
    name: string;
  }>;

  @IsArray()
  channels: Array<{
    category: string;
    name: string;
  }>;

  @IsArray()
  specialists: Array<{
    category: string;
    name: string;
  }>;
}

export default CreateUserDto;
