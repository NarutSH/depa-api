import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEmail, IsOptional, IsString } from 'class-validator';

class CreateUserDto {
  @ApiProperty({
    description: 'User full name in Thai',
    example: 'สมชาย ใจดี',
  })
  @IsString()
  @IsOptional()
  fullnameTh?: string;

  @ApiPropertyOptional({
    description: 'User full name in English',
    example: 'John Smith',
  })
  @IsOptional()
  @IsString()
  fullnameEn?: string;

  @ApiPropertyOptional({
    description: 'About the user - brief description or bio',
    example:
      'Experienced software developer with expertise in web applications',
  })
  @IsOptional()
  @IsString()
  about?: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+66812345678',
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.smith@example.com',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'User website URL',
    example: 'https://johnsmith.dev',
  })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({
    description: 'User location',
    example: 'Bangkok, Thailand',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: 'Industries associated with the user',
    type: () => [String],
    example: ['information-technology', 'digital-marketing'],
  })
  @IsArray()
  industries: string[];

  @ApiPropertyOptional({
    description: 'User tags with categories',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Tag category',
          example: 'skill',
        },
        name: {
          type: 'string',
          description: 'Tag name',
          example: 'JavaScript',
        },
      },
    },
    example: [
      { category: 'skill', name: 'JavaScript' },
      { category: 'interest', name: 'Artificial Intelligence' },
    ],
  })
  @IsArray()
  @IsOptional()
  tags?: Array<{
    category: string;
    name: string;
  }>;

  @ApiProperty({
    description: 'User communication channels',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Channel category',
          example: 'email',
        },
        name: {
          type: 'string',
          description: 'Channel identifier',
          example: 'support@example.com',
        },
      },
    },
    example: [
      { category: 'email', name: 'support@example.com' },
      { category: 'LINE', name: '@username' },
    ],
  })
  @IsArray()
  channels: Array<{
    category: string;
    name: string;
  }>;

  @ApiProperty({
    description: 'User specializations and expertise',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Specialization category',
          example: 'programming',
        },
        name: {
          type: 'string',
          description: 'Specialization name',
          example: 'Backend Development',
        },
      },
    },
    example: [
      { category: 'programming', name: 'Backend Development' },
      { category: 'design', name: 'UX/UI Design' },
    ],
  })
  @IsArray()
  specialists: Array<{
    category: string;
    name: string;
  }>;

  @ApiPropertyOptional({
    description: 'Tags in JSON format (internal use)',
    type: 'array',
    items: { type: 'object' },
  })
  @IsArray()
  @IsOptional()
  tags_json?: Array<{
    category: string;
    name: string;
  }>;

  @ApiPropertyOptional({
    description: 'Channels in JSON format (internal use)',
    type: 'array',
    items: { type: 'object' },
  })
  @IsArray()
  @IsOptional()
  channels_json?: Array<{
    category: string;
    name: string;
  }>;

  @ApiPropertyOptional({
    description: 'Specialists in JSON format (internal use)',
    type: 'array',
    items: { type: 'object' },
  })
  @IsArray()
  @IsOptional()
  specialists_json?: Array<{
    category: string;
    name: string;
  }>;
}

export default CreateUserDto;
