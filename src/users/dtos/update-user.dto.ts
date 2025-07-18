import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

class UpdateUserDto {
  @ApiPropertyOptional({
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

  @ApiPropertyOptional({
    description: 'Industries associated with the user',
    type: () => [String],
    example: ['information-technology', 'digital-marketing'],
  })
  @IsArray()
  @IsOptional()
  industries?: string[];

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

  @ApiPropertyOptional({
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
  @IsOptional()
  channels?: Array<{
    category: string;
    name: string;
  }>;

  @ApiPropertyOptional({
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
  @IsOptional()
  specialists?: Array<{
    category: string;
    name: string;
  }>;

  @ApiPropertyOptional({
    description: 'Tags as array of strings (alternative format)',
    type: () => [String],
    example: ['JavaScript', 'React', 'Node.js'],
  })
  @IsArray()
  @IsOptional()
  tags_array?: Array<string>;

  @ApiPropertyOptional({
    description: 'Channels as array of strings (alternative format)',
    type: () => [String],
    example: ['email', 'LINE', 'phone'],
  })
  @IsArray()
  @IsOptional()
  channels_array?: Array<string>;

  @ApiPropertyOptional({
    description: 'Specialists as array of strings (alternative format)',
    type: () => [String],
    example: ['Backend Development', 'UX/UI Design'],
  })
  @IsArray()
  @IsOptional()
  specialists_array?: Array<string>;
}

export default UpdateUserDto;
