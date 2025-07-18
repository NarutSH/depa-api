import { ApiProperty } from '@nestjs/swagger';

export class CompanyRevenueCompanyInfo {
  @ApiProperty({
    description: 'Company juristic ID',
    example: 'CMP001',
  })
  juristicId: string;

  @ApiProperty({
    description: 'Company name in Thai',
    example: 'บริษัท เทคโนโลยี จำกัด',
  })
  nameTh: string;

  @ApiProperty({
    description: 'Company name in English',
    example: 'Technology Company Ltd.',
  })
  nameEn: string;
}

export class CompanyRevenueResponse {
  @ApiProperty({
    description: 'Unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Year of the revenue record',
    example: 2024,
  })
  year: number;

  @ApiProperty({
    description: 'Company ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  companyId: string;

  @ApiProperty({
    description: 'Total revenue amount',
    example: 1000000,
  })
  total: number;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Company information',
    type: CompanyRevenueCompanyInfo,
  })
  company: CompanyRevenueCompanyInfo;
}

export class GetCompanyRevenuesResponse {
  @ApiProperty({
    description: 'Array of company revenue records',
    type: () => [CompanyRevenueResponse],
  })
  data: CompanyRevenueResponse[];

  @ApiProperty({
    description: 'Total number of records',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Response message',
    example: 'Company revenue data retrieved successfully',
  })
  message: string;
}

export class GetCompanyRevenuesByCompanyIdResponse {
  @ApiProperty({
    description: 'Array of company revenue records for specific company',
    type: () => [CompanyRevenueResponse],
  })
  data: CompanyRevenueResponse[];

  @ApiProperty({
    description: 'Total number of records for this company',
    example: 5,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Response message',
    example: 'Company revenue data for company ID retrieved successfully',
  })
  message: string;
}

export class CreateCompanyRevenueResponse {
  @ApiProperty({
    description: 'Created or updated company revenue record',
    type: CompanyRevenueResponse,
  })
  data: CompanyRevenueResponse;
}
