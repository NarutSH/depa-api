import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Base user data structure
export class UserDataDto {
  @ApiProperty({ description: 'User unique identifier' })
  id: string;

  @ApiPropertyOptional({ description: 'User full name in Thai' })
  fullnameTh?: string;

  @ApiPropertyOptional({ description: 'User full name in English' })
  fullnameEn?: string;

  @ApiProperty({ description: 'User email address' })
  email: string;

  @ApiPropertyOptional({ description: 'About the user' })
  about?: string;

  @ApiPropertyOptional({ description: 'User phone number' })
  phoneNumber?: string;

  @ApiPropertyOptional({ description: 'User website' })
  website?: string;

  @ApiPropertyOptional({ description: 'User location' })
  location?: string;

  @ApiPropertyOptional({ description: 'User type' })
  userType?: string;

  @ApiProperty({ description: 'User creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'User last update date' })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Associated company information',
    type: 'object',
    properties: {
      id: { type: 'string' },
      nameTh: { type: 'string' },
      nameEn: { type: 'string' },
      juristicId: { type: 'string' },
    },
  })
  company?: {
    id: string;
    nameTh?: string;
    nameEn?: string;
    juristicId?: string;
  };

  @ApiPropertyOptional({
    description: 'Associated freelance information',
    type: 'object',
    properties: {
      id: { type: 'string' },
      firstNameTh: { type: 'string' },
      lastNameTh: { type: 'string' },
      firstNameEn: { type: 'string' },
      lastNameEn: { type: 'string' },
      juristicId: { type: 'string' },
    },
  })
  freelance?: {
    id: string;
    firstNameTh?: string;
    lastNameTh?: string;
    firstNameEn?: string;
    lastNameEn?: string;
    juristicId?: string;
  };

  @ApiPropertyOptional({
    description: 'User industry tags',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        tag: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            slug: { type: 'string' },
            industry: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                slug: { type: 'string' },
              },
            },
          },
        },
      },
    },
  })
  industryTags?: Array<{
    tag: {
      name: string;
      slug: string;
      industry: {
        name: string;
        slug: string;
      };
    };
  }>;

  @ApiPropertyOptional({
    description: 'User industry channels',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        channel: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            slug: { type: 'string' },
            industry: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                slug: { type: 'string' },
              },
            },
          },
        },
      },
    },
  })
  industryChannels?: Array<{
    channel: {
      name: string;
      slug: string;
      industry: {
        name: string;
        slug: string;
      };
    };
  }>;

  @ApiPropertyOptional({
    description: 'User industry skills',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        skill: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            slug: { type: 'string' },
            industry: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                slug: { type: 'string' },
              },
            },
          },
        },
      },
    },
  })
  industrySkills?: Array<{
    skill: {
      title: string;
      slug: string;
      industry: {
        name: string;
        slug: string;
      };
    };
  }>;

  @ApiPropertyOptional({
    description: 'Related industries',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        industry: { type: 'object' },
      },
    },
  })
  industriesRelated?: Array<{
    industry: any;
  }>;
}

// Pagination metadata
export class PaginationMetadataDto {
  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Items per page' })
  limit: number;

  @ApiProperty({ description: 'Total number of items' })
  total: number;

  @ApiProperty({ description: 'Total number of pages' })
  pageCount: number;

  @ApiProperty({ description: 'Has next page' })
  hasNextPage: boolean;

  @ApiProperty({ description: 'Has previous page' })
  hasPreviousPage: boolean;
}

// Single user response
export class SingleUserResponseDto {
  @ApiProperty({ type: UserDataDto, description: 'User data' })
  data: UserDataDto;

  @ApiProperty({ description: 'Operation success status', example: true })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'User retrieved successfully',
  })
  message: string;
}

// Multiple users response with pagination
export class MultipleUsersResponseDto {
  @ApiProperty({
    type: [UserDataDto],
    description: 'Array of user data',
  })
  data: UserDataDto[];

  @ApiProperty({
    type: PaginationMetadataDto,
    description: 'Pagination metadata',
  })
  meta: PaginationMetadataDto;

  @ApiProperty({ description: 'Operation success status', example: true })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Users retrieved successfully',
  })
  message: string;
}

// User creation response
export class CreateUserResponseDto {
  @ApiProperty({ type: UserDataDto, description: 'Created user data' })
  data: UserDataDto;

  @ApiProperty({ description: 'Operation success status', example: true })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'User created successfully',
  })
  message: string;
}

// User update response
export class UpdateUserResponseDto {
  @ApiProperty({ type: UserDataDto, description: 'Updated user data' })
  data: UserDataDto;

  @ApiProperty({ description: 'Operation success status', example: true })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'User updated successfully',
  })
  message: string;
}
