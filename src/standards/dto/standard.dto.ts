import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StandardsType } from 'generated/prisma';

export class CreateStandardDto {
  @ApiProperty({
    description: 'Standard name',
    example: 'ISO 27001 Information Security Management',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Detailed description of the standard',
    example:
      'International standard for information security management systems',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Type of standard',
    enum: StandardsType,
    example: 'CERTIFICATION',
    enumName: 'StandardsType',
  })
  @IsEnum(StandardsType)
  type: StandardsType;

  @ApiProperty({
    description: 'Industry slug this standard belongs to',
    example: 'information-technology',
  })
  @IsString()
  industrySlug: string;

  @ApiProperty({
    description: 'Image path for the standard',
    example: '/uploads/standards/iso-27001.png',
    required: false,
  })
  @IsString()
  @IsOptional()
  image?: string;
}

export class UpdateStandardDto {
  @ApiProperty({
    description: 'Updated standard name',
    example: 'ISO 27001 Information Security Management System',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Updated description of the standard',
    example:
      'International standard for information security management systems with enhanced controls',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Updated type of standard',
    enum: StandardsType,
    example: 'CERTIFICATION',
    enumName: 'StandardsType',
    required: false,
  })
  @IsEnum(StandardsType)
  @IsOptional()
  type?: StandardsType;

  @ApiProperty({
    description: 'Updated industry slug',
    example: 'information-technology',
    required: false,
  })
  @IsString()
  @IsOptional()
  industrySlug?: string;

  @ApiProperty({
    description: 'Updated image path',
    example: '/uploads/standards/iso-27001-updated.png',
    required: false,
  })
  @IsString()
  @IsOptional()
  image?: string;
}
