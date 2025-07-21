import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({
    description: 'Company juristic ID',
    example: '1234567890123',
  })
  @IsString()
  juristicId: string;

  @ApiProperty({
    description: 'Company name in Thai',
    example: 'บริษัท เทคโนโลยี จำกัด',
  })
  @IsString()
  nameTh: string;

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
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Sub-district',
    example: 'Silom',
    required: false,
  })
  @IsString()
  @IsOptional()
  subDistrict?: string;

  @ApiProperty({
    description: 'District',
    example: 'Bang Rak',
    required: false,
  })
  @IsString()
  @IsOptional()
  district?: string;

  @ApiProperty({
    description: 'Province',
    example: 'Bangkok',
    required: false,
  })
  @IsString()
  @IsOptional()
  province?: string;

  @ApiProperty({
    description: 'Postal code',
    example: '10500',
    required: false,
  })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiProperty({
    description: 'Registered capital amount',
    example: 1000000,
  })
  @IsNumber()
  registerdCapital: number;

  @ApiProperty({
    description: 'Number of employees',
    example: 50,
  })
  @IsNumber()
  employeeCount: number;

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
  })
  @IsString()
  userId: string;

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
