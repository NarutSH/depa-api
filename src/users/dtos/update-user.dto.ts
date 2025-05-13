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
  tags_json?: Array<{
    category: string;
    name: string;
  }>;

  @IsArray()
  @IsOptional()
  channels_json?: Array<{
    category: string;
    name: string;
  }>;

  @IsArray()
  @IsOptional()
  specialists_json?: Array<{
    category: string;
    name: string;
  }>;

  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => ChannelDto)
  // tags_json?: ChannelDto[];

  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => ChannelDto)
  // channels_json?: ChannelDto[];

  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => ChannelDto)
  // specialists_json?: ChannelDto[];
}

export default UpdateUserDto;
