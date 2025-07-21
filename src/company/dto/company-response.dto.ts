import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto, CompanyRevenueDto } from './related-response.dto';

export class CompanyResponseDto {
  @ApiProperty({
    description: 'Company unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Company juristic ID',
    example: '1234567890123',
  })
  juristicId: string;

  @ApiProperty({
    description: 'Company name in Thai',
    example: 'บริษัท เทคโนโลยี จำกัด',
  })
  nameTh: string;

  @ApiProperty({
    description: 'Company name in English',
    example: 'Technology Company Limited',
    required: false,
  })
  nameEn?: string;

  @ApiProperty({
    description: 'Company description',
    example:
      'A leading technology company specializing in software development',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Company description in English',
    example:
      'A leading technology company specializing in software development',
    required: false,
  })
  description_en?: string;

  @ApiProperty({
    description: 'Company logo image URL',
    example: 'https://example.com/logo.png',
    required: false,
  })
  image?: string;

  @ApiProperty({
    description: 'Company cover image URL',
    example: 'https://example.com/cover.jpg',
    required: false,
  })
  cover_image?: string;

  @ApiProperty({
    description: 'Company address',
    example: '123 Technology Street',
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
    description: 'Registered capital amount',
    example: 1000000,
    required: false,
  })
  registerdCapital?: number;

  @ApiProperty({
    description: 'Number of employees',
    example: 50,
    required: false,
  })
  employeeCount?: number;

  @ApiProperty({
    description: 'Company phone number',
    example: '+66-2-123-4567',
    required: false,
  })
  phoneNumber?: string;

  @ApiProperty({
    description: 'Company email address',
    example: 'contact@company.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: 'Company website URL',
    example: 'https://www.company.com',
    required: false,
  })
  website?: string;

  @ApiProperty({
    description: 'Company logo URL',
    example: 'https://example.com/logo.png',
    required: false,
  })
  logo?: string;

  @ApiProperty({
    description: 'Associated user ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    description: 'Legacy industries array',
    example: ['technology', 'software'],
    type: [String],
    required: false,
  })
  industries?: string[];

  @ApiProperty({
    description: 'Company creation timestamp',
    example: '2025-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Company last update timestamp',
    example: '2025-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}

export class CompanyWithUserResponseDto extends CompanyResponseDto {
  @ApiProperty({
    description: 'Associated user information',
    type: UserResponseDto,
  })
  user?: UserResponseDto;
}

export class CompanyWithRevenueResponseDto extends CompanyResponseDto {
  @ApiProperty({
    description: 'Company revenue records',
    type: [CompanyRevenueDto],
  })
  companyRevenue?: CompanyRevenueDto[];
}

export class CompanyListResponseDto {
  @ApiProperty({
    description: 'Array of companies with pagination',
    type: [CompanyWithUserResponseDto],
  })
  data: CompanyWithUserResponseDto[];

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
}

export class CompanyAllResponseDto {
  @ApiProperty({
    description: 'Array of all companies without pagination',
    type: [CompanyWithUserResponseDto],
  })
  data: CompanyWithUserResponseDto[];
}

export class SingleCompanyResponseDto {
  @ApiProperty({
    description: 'Single company data',
    type: CompanyResponseDto,
  })
  data: CompanyResponseDto;
}

export class SingleCompanyWithUserResponseDto {
  @ApiProperty({
    description: 'Single company data with user information',
    type: CompanyWithUserResponseDto,
  })
  data: CompanyWithUserResponseDto;
}

export class SingleCompanyWithRevenueResponseDto {
  @ApiProperty({
    description: 'Single company data with revenue information',
    type: CompanyWithRevenueResponseDto,
  })
  data: CompanyWithRevenueResponseDto;
}
