import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/company/dto/related-response.dto';

export class FreelanceResponseDto {
  @ApiProperty({
    description: 'Freelance unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Freelance juristic ID',
    example: '1234567890123',
    required: false,
  })
  juristicId?: string;

  @ApiProperty({
    description: 'First name in Thai',
    example: 'สมชาย',
  })
  firstNameTh: string;

  @ApiProperty({
    description: 'Last name in Thai',
    example: 'ใจดี',
  })
  lastNameTh: string;

  @ApiProperty({
    description: 'First name in English',
    example: 'John',
    required: false,
  })
  firstNameEn?: string;

  @ApiProperty({
    description: 'Last name in English',
    example: 'Doe',
    required: false,
  })
  lastNameEn?: string;

  @ApiProperty({
    description: 'Email address',
    example: 'freelancer@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+66-123-456-789',
    required: false,
  })
  phoneNumber?: string;

  @ApiProperty({
    description: 'Address',
    example: '123 Freelancer Street',
    required: false,
  })
  address?: string;

  @ApiProperty({
    description: 'Sub-district',
    example: 'Silom',
    required: false,
  })
  subDistrict?: string;

  @ApiProperty({
    description: 'District',
    example: 'Bang Rak',
    required: false,
  })
  district?: string;

  @ApiProperty({
    description: 'Province',
    example: 'Bangkok',
    required: false,
  })
  province?: string;

  @ApiProperty({
    description: 'Postal code',
    example: '10500',
    required: false,
  })
  postalCode?: string;

  @ApiProperty({
    description: 'Profile image URL',
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  image?: string;

  @ApiProperty({
    description: 'Cover image URL',
    example: 'https://example.com/cover.jpg',
    required: false,
  })
  cover_image?: string;

  @ApiProperty({
    description: 'Associated user ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    description: 'Industry types array',
    example: ['technology', 'design'],
    type: [String],
    required: false,
  })
  industryTypes?: string[];

  @ApiProperty({
    description: 'Freelance creation timestamp',
    example: '2025-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Freelance last update timestamp',
    example: '2025-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}

export class PortfolioImageDto {
  @ApiProperty({
    description: 'Image URL',
    example: 'https://example.com/portfolio/image1.jpg',
  })
  url: string;

  @ApiProperty({
    description: 'Image type',
    example: 'MAIN',
  })
  type: string;

  @ApiProperty({
    description: 'Image description',
    example: 'Project screenshot',
    required: false,
  })
  description?: string;
}

export class PortfolioDto {
  @ApiProperty({
    description: 'Portfolio unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Portfolio title',
    example: 'Web Development Project',
  })
  title: string;

  @ApiProperty({
    description: 'Portfolio description',
    example: 'A complete e-commerce website built with React and Node.js',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Portfolio images',
    type: [PortfolioImageDto],
    required: false,
  })
  Image?: PortfolioImageDto[];
}

export class FreelanceWithUserResponseDto extends FreelanceResponseDto {
  @ApiProperty({
    description: 'Associated user information',
    type: UserResponseDto,
  })
  user?: UserResponseDto;
}

export class FreelanceWithPortfolioResponseDto extends FreelanceResponseDto {
  @ApiProperty({
    description: 'Associated user information',
    type: UserResponseDto,
  })
  user?: UserResponseDto;

  @ApiProperty({
    description: 'Portfolio items',
    type: [PortfolioDto],
    required: false,
  })
  Portfolio?: PortfolioDto[];
}

export class FreelanceListResponseDto {
  @ApiProperty({
    description: 'Array of freelances with pagination',
    type: [FreelanceWithPortfolioResponseDto],
  })
  data: FreelanceWithPortfolioResponseDto[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: 'object',
    properties: {
      total: { type: 'number', example: 100 },
      page: { type: 'number', example: 1 },
      limit: { type: 'number', example: 10 },
      totalPages: { type: 'number', example: 10 },
      hasNext: { type: 'boolean', example: true },
      hasPrevious: { type: 'boolean', example: false },
    },
    additionalProperties: false,
  })
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };

  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Freelances retrieved successfully',
    required: false,
  })
  message?: string;
}
