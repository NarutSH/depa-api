import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';
import { StandardsType } from '../../../generated/prisma';

export class CreateStandardsDto {
  @ApiProperty({
    description: 'Standards name',
    example: 'ESRB Mature',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Standards description',
    example: 'Entertainment Software Rating Board - Mature 17+',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Standards type',
    example: 'ESRB',
    enum: StandardsType,
  })
  @IsEnum(StandardsType)
  @IsNotEmpty()
  type: StandardsType;

  @ApiProperty({
    description: 'Industry slug that this standards belongs to',
    example: 'technology',
  })
  @IsString()
  @IsNotEmpty()
  industrySlug: string;

  @ApiProperty({
    description: 'Standards image URL',
    example: 'https://example.com/esrb-mature.png',
    required: false,
  })
  @IsString()
  @IsOptional()
  image?: string;
}
