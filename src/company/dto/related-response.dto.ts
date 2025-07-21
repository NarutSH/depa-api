import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'User unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    required: false,
  })
  firstName?: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    required: false,
  })
  lastName?: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+66-123-456-789',
    required: false,
  })
  phoneNumber?: string;

  @ApiProperty({
    description: 'User role',
    example: 'COMPANY',
    enum: ['COMPANY', 'FREELANCE', 'ADMIN'],
  })
  role: string;

  @ApiProperty({
    description: 'User creation timestamp',
    example: '2025-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'User last update timestamp',
    example: '2025-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}

export class CompanyRevenueDto {
  @ApiProperty({
    description: 'Revenue record unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Revenue year',
    example: 2024,
  })
  year: number;

  @ApiProperty({
    description: 'Total revenue amount',
    example: 5000000,
  })
  total: number;

  @ApiProperty({
    description: 'Associated company ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  companyId: string;

  @ApiProperty({
    description: 'Revenue record creation timestamp',
    example: '2025-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Revenue record last update timestamp',
    example: '2025-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
