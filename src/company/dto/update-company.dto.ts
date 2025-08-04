import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCompanyDto {
  @ApiProperty({
    description: 'Company juristic ID',
    example: '1234567890123',
    required: false,
  })
  @IsOptional()
  @IsString()
  juristicId?: string;

  @ApiProperty({
    description: 'Company name in Thai',
    example: 'บริษัท เทคโนโลยี จำกัด',
    required: false,
  })
  @IsOptional()
  @IsString()
  nameTh?: string;

  @ApiProperty({
    description: 'Company name in English',
    example: 'Technology Company Limited',
    required: false,
  })
  @IsOptional()
  @IsString()
  nameEn?: string;

  @ApiProperty({
    description: 'Company description',
    example:
      'A leading technology company specializing in software development',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Company address',
    example: '123 Technology Street',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'Sub-district',
    example: 'Silom',
    required: false,
  })
  @IsOptional()
  @IsString()
  subDistrict?: string;

  @ApiProperty({
    description: 'District',
    example: 'Bang Rak',
    required: false,
  })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiProperty({
    description: 'Province',
    example: 'Bangkok',
    required: false,
  })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiProperty({
    description: 'Postal code',
    example: '10500',
    required: false,
  })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiProperty({
    description: 'Registered capital amount',
    example: 1000000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  registerdCapital?: number;

  @ApiProperty({
    description: 'Number of employees',
    example: 50,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  employeeCount?: number;

  @ApiProperty({
    description: 'Company phone number',
    example: '+66-2-123-4567',
    required: false,
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({
    description: 'Company email address',
    example: 'contact@company.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Company website URL',
    example: 'https://www.company.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({
    description: 'Company logo URL',
    example: 'https://example.com/logo.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({
    description: 'Associated user ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({
    description: 'Company image URL',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    description: 'Company cover image URL',
    example: 'https://example.com/cover.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  cover_image?: string;
}
