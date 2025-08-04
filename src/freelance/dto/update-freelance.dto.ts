import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFreelanceDto {
  @ApiProperty({
    description: 'User ID associated with this freelance',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({
    description: 'First name in Thai',
    example: 'สมชาย',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstNameTh?: string;

  @ApiProperty({
    description: 'Last name in Thai',
    example: 'ใจดี',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastNameTh?: string;

  @ApiProperty({
    description: 'First name in English',
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstNameEn?: string;

  @ApiProperty({
    description: 'Last name in English',
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastNameEn?: string;

  @ApiProperty({
    description: 'Address',
    example: '123 Main Street',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'Sub-district/Tambon',
    example: 'Silom',
    required: false,
  })
  @IsOptional()
  @IsString()
  subDistrict?: string;

  @ApiProperty({
    description: 'District/Amphoe',
    example: 'Bang Rak',
    required: false,
  })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiProperty({
    description: 'Province/Changwat',
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
    description: 'Contact phone number',
    example: '+66-123-456-789',
    required: false,
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Juristic ID (if applicable)',
    example: '1234567890123',
    required: false,
  })
  @IsOptional()
  @IsString()
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
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    description: 'Cover image URL',
    example: 'https://example.com/cover.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  cover_image?: string;
}
