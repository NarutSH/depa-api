import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

class UpdateUserDto {
  @ApiPropertyOptional({ description: 'User full name in Thai' })
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

  @ApiPropertyOptional({ description: 'User website' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ description: 'User location' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    description: 'Industries associated with the user',
    type: [String],
    example: ['technology', 'healthcare'],
  })
  @IsArray()
  @IsOptional()
  industries?: string[];

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
      { category: 'skill', name: 'javascript' },
      { category: 'technology', name: 'react' },
    ],
  })
  @IsArray()
  @IsOptional()
  tags?: Array<{
    category: string;
    name: string;
  }>;

  @ApiPropertyOptional({
    description: 'User channels',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        category: { type: 'string' },
        name: { type: 'string' },
      },
    },
    example: [
      { category: 'social', name: 'linkedin' },
      { category: 'professional', name: 'github' },
    ],
  })
  @IsArray()
  @IsOptional()
  channels?: Array<{
    category: string;
    name: string;
  }>;

  @ApiPropertyOptional({
    description: 'User specialists/skills',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        category: { type: 'string' },
        name: { type: 'string' },
      },
    },
    example: [
      { category: 'programming', name: 'typescript' },
      { category: 'design', name: 'figma' },
    ],
  })
  @IsArray()
  @IsOptional()
  specialists?: Array<{
    category: string;
    name: string;
  }>;

  @ApiPropertyOptional({
    description: 'User tags array (simplified)',
    type: [String],
    example: ['javascript', 'react', 'typescript'],
  })
  @IsArray()
  @IsOptional()
  tags_array?: Array<string>;

  @ApiPropertyOptional({
    description: 'User channels array (simplified)',
    type: [String],
    example: ['linkedin', 'github', 'behance'],
  })
  @IsArray()
  @IsOptional()
  channels_array?: Array<string>;

  @ApiPropertyOptional({
    description: 'User specialists array (simplified)',
    type: [String],
    example: ['typescript', 'figma', 'photoshop'],
  })
  @IsArray()
  @IsOptional()
  specialists_array?: Array<string>;
}

export default UpdateUserDto;
