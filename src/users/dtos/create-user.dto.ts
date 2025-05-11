import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEmail, IsOptional, IsString } from 'class-validator';

class CreateUserDto {
  @ApiProperty({ description: 'User full name in Thai' })
  @IsString()
  @IsOptional()
  fullnameTh?: string;

  @ApiPropertyOptional({ description: 'User full name in English' })
  @IsOptional()
  @IsString()
  fullnameEn?: string;

  @ApiPropertyOptional({ description: 'About the user' })
  @IsOptional()
  @IsString()
  about?: string;

  @ApiPropertyOptional({ description: 'User phone number' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ description: 'User website' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ description: 'User location' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: 'Industries associated with the user',
    type: [String],
    example: ['Technology', 'Healthcare'],
  })
  @IsArray()
  industries: string[];

  @ApiPropertyOptional({
    description: 'User tags',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        category: { type: 'string' },
        name: { type: 'string' },
      },
    },
    example: [
      { category: 'skill', name: 'JavaScript' },
      { category: 'interest', name: 'AI' },
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
        category: { type: 'string' },
        name: { type: 'string' },
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
    description: 'User specializations',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        category: { type: 'string' },
        name: { type: 'string' },
      },
    },
    example: [
      { category: 'programming', name: 'Backend Development' },
      { category: 'design', name: 'UX/UI' },
    ],
  })
  @IsArray()
  specialists: Array<{
    category: string;
    name: string;
  }>;
}

export default CreateUserDto;
