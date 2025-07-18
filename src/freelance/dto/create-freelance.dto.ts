import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFreelanceDto {
  @ApiProperty({ description: 'User ID associated with this freelance' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'First name in Thai' })
  @IsString()
  firstNameTh: string;

  @ApiProperty({ description: 'Last name in Thai' })
  @IsString()
  lastNameTh: string;

  @ApiProperty({ description: 'First name in English', required: false })
  @IsString()
  @IsOptional()
  firstNameEn?: string;

  @ApiProperty({ description: 'Last name in English', required: false })
  @IsString()
  @IsOptional()
  lastNameEn?: string;

  @ApiProperty({ description: 'Address', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ description: 'Sub-district/Tambon', required: false })
  @IsString()
  @IsOptional()
  subDistrict?: string;

  @ApiProperty({ description: 'District/Amphoe', required: false })
  @IsString()
  @IsOptional()
  district?: string;

  @ApiProperty({ description: 'Province/Changwat', required: false })
  @IsString()
  @IsOptional()
  province?: string;

  @ApiProperty({ description: 'Postal code', required: false })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiProperty({ description: 'Contact phone number', required: false })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ description: 'Email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Juristic ID (if applicable)', required: false })
  @IsString()
  @IsOptional()
  juristicId?: string;

  @ApiProperty({
    description: 'Types of industries the freelancer works in',
    type: () => [String],
    example: ['game', 'animation'],
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  industryTypes?: string[];

  @ApiProperty({ description: 'Profile image URL', required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ description: 'Cover image URL', required: false })
  @IsString()
  @IsOptional()
  cover_image?: string;
}
