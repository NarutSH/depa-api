import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class CreateCompanyDto {
  @ApiProperty({ description: 'Company juristic ID' })
  @IsString()
  juristicId: string;

  @ApiProperty({ description: 'Company name in Thai' })
  @IsString()
  nameTh: string;

  @ApiPropertyOptional({ description: 'Company name in English' })
  @IsOptional()
  @IsString()
  nameEn?: string;

  @ApiPropertyOptional({ description: 'Company description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Company address' })
  @IsString()
  address: string;

  @ApiPropertyOptional({ description: 'Sub-district' })
  @IsString()
  @IsOptional()
  subDistrict?: string;

  @ApiPropertyOptional({ description: 'District' })
  @IsString()
  @IsOptional()
  district?: string;

  @ApiPropertyOptional({ description: 'Province' })
  @IsString()
  @IsOptional()
  province?: string;

  @ApiPropertyOptional({ description: 'Postal code' })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiProperty({ description: 'Registered capital amount' })
  @IsNumber()
  registerdCapital: number;

  @ApiProperty({ description: 'Number of employees' })
  @IsNumber()
  employeeCount: number;

  @ApiPropertyOptional({ description: 'Company phone number' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ description: 'Company email address' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Company website URL' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ description: 'Company logo URL' })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({ description: 'User ID associated with the company' })
  @IsString()
  userId: string;

  @ApiPropertyOptional({ description: 'Company image URL' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ description: 'Company cover image URL' })
  @IsOptional()
  @IsString()
  cover_image?: string;
}

export default CreateCompanyDto;
