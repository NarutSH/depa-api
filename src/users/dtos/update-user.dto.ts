import { IsArray, IsOptional, IsString } from 'class-validator';

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

  @IsArray()
  @IsOptional()
  industries?: string[];

  @IsArray()
  @IsOptional()
  tags?: Array<{
    category: string;
    name: string;
  }>;

  @IsArray()
  @IsOptional()
  channels?: Array<{
    category: string;
    name: string;
  }>;

  @IsArray()
  @IsOptional()
  specialists?: Array<{
    category: string;
    name: string;
  }>;

  @IsArray()
  @IsOptional()
  tags_array?: Array<string>;

  @IsArray()
  @IsOptional()
  channels_array?: Array<string>;

  @IsArray()
  @IsOptional()
  specialists_array?: Array<string>;
}

export default UpdateUserDto;
