import { ApiProperty } from '@nestjs/swagger';

export class FreelanceApiResponse {
  @ApiProperty({ description: 'Freelance ID' })
  id: string;

  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({ description: 'First name in Thai' })
  firstNameTh: string;

  @ApiProperty({ description: 'Last name in Thai' })
  lastNameTh: string;

  @ApiProperty({ description: 'First name in English', required: false })
  firstNameEn?: string;

  @ApiProperty({ description: 'Last name in English', required: false })
  lastNameEn?: string;

  @ApiProperty({ description: 'Email address' })
  email: string;

  @ApiProperty({ description: 'Phone number', required: false })
  phoneNumber?: string;

  @ApiProperty({ description: 'Address', required: false })
  address?: string;

  @ApiProperty({
    description: 'Industry types',
    type: () => [String],
    required: false,
  })
  industryTypes?: string[];

  @ApiProperty({ description: 'Profile image URL', required: false })
  image?: string;

  @ApiProperty({ description: 'Cover image URL', required: false })
  cover_image?: string;

  @ApiProperty({ description: 'Juristic ID', required: false })
  juristicId?: string;

  @ApiProperty({ description: 'Created at timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at timestamp' })
  updatedAt: Date;
}

export class FreelanceWithUserResponse extends FreelanceApiResponse {
  @ApiProperty({ description: 'Associated user data' })
  user: any;
}

export class FreelanceWithExtendedUserResponse extends FreelanceApiResponse {
  @ApiProperty({ description: 'User with extended industry relations' })
  user: any;
}

export class FreelanceWithDetailsResponse extends FreelanceApiResponse {
  @ApiProperty({ description: 'User with detailed information' })
  user: any;

  @ApiProperty({ description: 'Portfolio data', type: () => [Object] })
  Portfolio: any[];
}

export class FreelancesPaginationMeta {
  @ApiProperty({ description: 'Total number of freelances' })
  total: number;

  @ApiProperty({ description: 'Current page' })
  page: number;

  @ApiProperty({ description: 'Items per page' })
  limit: number;

  @ApiProperty({ description: 'Total pages' })
  totalPages: number;

  @ApiProperty({ description: 'Has next page' })
  hasNext: boolean;

  @ApiProperty({ description: 'Has previous page' })
  hasPrevious: boolean;
}

export class GetFreelancesApiResponse {
  @ApiProperty({
    description: 'Array of freelances',
    type: () => [FreelanceWithDetailsResponse],
  })
  data: FreelanceWithDetailsResponse[];

  @ApiProperty({ description: 'Pagination metadata' })
  meta: FreelancesPaginationMeta;

  @ApiProperty({ description: 'Response message' })
  message: string;
}
