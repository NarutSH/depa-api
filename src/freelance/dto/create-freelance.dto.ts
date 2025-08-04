import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFreelanceDto {
  @ApiProperty({
    description: 'User ID associated with this freelance',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'First name in Thai',
    example: 'สมชาย',
  })
  @IsString()
  firstNameTh: string;

  @ApiProperty({
    description: 'Last name in Thai',
    example: 'ใจดี',
  })
  @IsString()
  lastNameTh: string;

  @ApiProperty({
    description: 'First name in English',
    example: 'John',
    required: false,
  })
  @IsString()
  @IsOptional()
  firstNameEn?: string;

  @ApiProperty({
    description: 'Last name in English',
    example: 'Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  lastNameEn?: string;

  @ApiProperty({
    description: 'Address',
    example: '123 Main Street',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'Sub-district/Tambon',
    example: 'Silom',
    required: false,
  })
  @IsString()
  @IsOptional()
  subDistrict?: string;

  @ApiProperty({
    description: 'District/Amphoe',
    example: 'Bang Rak',
    required: false,
  })
  @IsString()
  @IsOptional()
  district?: string;

  @ApiProperty({
    description: 'Province/Changwat',
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
    description: 'Contact phone number',
    example: '+66-123-456-789',
    required: false,
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Juristic ID (if applicable)',
    example: '1234567890123',
    required: false,
  })
  @IsString()
  @IsOptional()
  juristicId?: string;

  @ApiProperty({
    description: 'Types of industries the freelancer works in',
    type: [String],
    example: ['game', 'animation'],
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  industryTypes?: string[];

  @ApiProperty({
    description: 'Profile image URL',
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({
    description: 'Cover image URL',
    example: 'https://example.com/cover.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  cover_image?: string;
}
