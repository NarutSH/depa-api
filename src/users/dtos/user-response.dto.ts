import { Prisma, User } from 'generated/prisma';
import { ResponseMetadata } from 'src/utils';

type JsonValue = Prisma.JsonValue;

/**
 * User with company relation
 */
export interface UserWithCompany extends User {
  company: {
    id: string;
    nameTh: string;
    nameEn: string;
    juristicId: string;
  } | null;
}

/**
 * User with freelance relation
 */
export interface UserWithFreelance extends User {
  freelance: {
    id: string;
    firstNameTh: string;
    lastNameTh: string;
    firstNameEn: string;
    lastNameEn: string;
    juristicId: string;
  } | null;
}

/**
 * User with industry relations
 */
export interface UserWithIndustryRelations extends User {
  company?: {
    id: string;
    juristicId: string;
    nameTh: string;
    nameEn: string;
  };
  freelance?: {
    id: string;
    juristicId: string;
    firstNameTh: string;
    lastNameTh: string;
    firstNameEn: string;
    lastNameEn: string;
  };
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
  industriesRelated?: Array<{
    industry: {
      name: string;
      slug: string;
    };
  }>;
}

/**
 * User with detailed relations
 */
export interface UserWithDetailedRelations {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  fullnameTh: string;
  fullnameEn?: string;
  about?: string;
  phoneNumber?: string;
  email: string;
  website?: string;
  location?: string;
  image?: string;
  tags_json?: JsonValue;
  channels_json?: JsonValue;
  specialists_json?: JsonValue;
  industries?: string[];
  industriesRelated?: Array<{
    industry: {
      id: string;
      name: string;
      slug: string;
      description: string;
      color: string;
      image: string;
      createdAt: Date;
      updatedAt: Date;
      displayNameTh?: string;
      displayNameEn?: string;
    };
  }>;
  industryTags?: Array<{
    tag: {
      id: string;
      name: string;
      slug: string;
      industrySlug: string;
      createdAt: Date;
      updatedAt: Date;
      displayNameTh?: string;
      displayNameEn?: string;
    };
  }>;
  industryChannels?: Array<{
    channel: {
      id: string;
      name: string;
      slug: string;
      industrySlug: string;
      createdAt: Date;
      updatedAt: Date;
      displayNameTh?: string;
      displayNameEn?: string;
    };
  }>;
  industrySkills?: Array<{
    skill: {
      id: string;
      title: string;
      slug: string;
      industrySlug: string;
      group: string;
      freelanceId: string;
      createdAt: Date;
      updatedAt: Date;
      displayNameTh?: string;
      displayNameEn?: string;
    };
  }>;
  company?: {
    id: string;
    juristicId: string;
    nameTh: string;
    nameEn: string;
  };
  freelance?: {
    id: string;
    juristicId: string;
    firstNameTh: string;
    lastNameTh: string;
    firstNameEn: string;
    lastNameEn: string;
  };
}

/**
 * User with revenue relations
 */
export interface UserWithRevenueRelations {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  fullnameTh: string;
  fullnameEn?: string;
  about?: string;
  phoneNumber?: string;
  email: string;
  website?: string;
  location?: string;
  image?: string;
  tags_json?: JsonValue;
  channels_json?: JsonValue;
  specialists_json?: JsonValue;
  industries?: string[];
  company?: {
    id: string;
    juristicId: string;
    nameTh: string;
    nameEn: string;
    companyRevenue?: Array<{
      total: number;
      year: number;
      createdAt: Date;
      updatedAt: Date;
    }>;
  };
  freelance?: {
    id: string;
    juristicId: string;
    firstNameTh: string;
    lastNameTh: string;
    firstNameEn: string;
    lastNameEn: string;
  };
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
  industriesRelated?: Array<{
    industry: {
      name: string;
      slug: string;
    };
  }>;
  revenueStreams?: Array<{
    id: string;
    name: string;
    displayNameTh: string;
    displayNameEn?: string;
    descriptionTh?: string;
    descriptionEn?: string;
    image?: string;
  }>;
}

/**
 * Transformed user response interface
 */
export interface TransformedUserResponse {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  fullnameTh: string;
  fullnameEn?: string;
  about?: string;
  phoneNumber?: string;
  email: string;
  website?: string;
  location?: string;
  image?: string;
  tags: JsonValue[];
  channels: JsonValue[];
  specialists: JsonValue[];
  tags_json?: JsonValue;
  channels_json?: JsonValue;
  specialists_json?: JsonValue;
  industries: string[];
  industryTags?: Array<{
    name: string;
    slug: string;
    industry: {
      name: string;
      slug: string;
    };
  }>;
  industryChannels?: Array<{
    name: string;
    slug: string;
    industry: {
      name: string;
      slug: string;
    };
  }>;
  industrySkills?: Array<{
    title: string;
    slug: string;
    industry: {
      name: string;
      slug: string;
    };
  }>;
  industriesRelated?: Array<{
    industry: {
      description: string;
      name: string;
      createdAt: Date;
      id: string;
      image: string;
      updatedAt: Date;
      slug: string;
      color: string;
    };
  }>;
  company?: {
    id: string;
    juristicId: string;
    nameTh: string;
    nameEn: string;
  };
  freelance?: {
    id: string;
    juristicId: string;
    firstNameTh: string;
    lastNameTh: string;
    firstNameEn: string;
    lastNameEn: string;
  };
}

// Temporarily commented out to resolve circular dependency
// export class UserResponseDto {
//   @ApiProperty({
//     description: 'User unique identifier',
//     example: 'clxyz123456789',
//   })
//   id: string;

//   @ApiProperty({
//     description: 'User creation timestamp',
//     example: '2024-01-01T00:00:00.000Z',
//     type: Date,
//   })
//   createdAt: Date;

//   @ApiProperty({
//     description: 'User last update timestamp',
//     example: '2024-01-01T00:00:00.000Z',
//     type: Date,
//   })
//   updatedAt: Date;

//   @ApiProperty({
//     description: 'User full name in Thai',
//     example: 'สมชาย ใจดี',
//   })
//   fullnameTh: string;

//   @ApiProperty({
//     description: 'User full name in English',
//     example: 'John Smith',
//     required: false,
//   })
//   fullnameEn?: string;

//   @ApiProperty({
//     description: 'User about/bio section',
//     example: 'Experienced software developer with 5+ years in web development',
//     required: false,
//   })
//   about?: string;

//   @ApiProperty({
//     description: 'User phone number',
//     example: '+66812345678',
//     required: false,
//   })
//   phoneNumber?: string;

//   @ApiProperty({
//     description: 'User email address',
//     example: 'john.smith@example.com',
//   })
//   email: string;

//   @ApiProperty({
//     description: 'User website URL',
//     example: 'https://johnsmith.dev',
//     required: false,
//   })
//   website?: string;

//   @ApiProperty({
//     description: 'User location/address',
//     example: 'Bangkok, Thailand',
//     required: false,
//   })
//   location?: string;

//   @ApiProperty({
//     description: 'User profile image URL',
//     example: 'https://example.com/images/profile.jpg',
//     required: false,
//   })
//   image?: string;

//   @ApiProperty({
//     description: 'User industry associations',
//     example: ['information-technology', 'digital-marketing'],
//     type: [String],
//     required: false,
//   })
//   industries?: string[];
// }

/*
 * Paginated users response DTO
 */
/*
export class PaginatedUsersResponseDto {
  @ApiProperty({
    description: 'Array of users',
    type: () => [Object],
  })
  data: any[];

  @ApiProperty({
    description: 'Total number of users',
    example: 100,
    type: Number,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
    type: Number,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    type: Number,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 10,
    type: Number,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Whether there is a next page',
    example: true,
    type: Boolean,
  })
  hasNext: boolean;

  @ApiProperty({
    description: 'Whether there is a previous page',
    example: false,
    type: Boolean,
  })
  hasPrev: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Users retrieved successfully',
  })
  message: string;
}
*/

/**
 * Response type for getAllUsers
 */
export type GetAllUsersResponse = ResponseMetadata<UserWithIndustryRelations[]>;

/**
 * Response type for getUserById
 */
export type GetUserByIdResponse = UserWithDetailedRelations;

/**
 * Response type for getUserByEmail
 */
export type GetUserByEmailResponse = UserWithRevenueRelations;

/**
 * Response type for getMe
 */
export type GetMeResponse = TransformedUserResponse;

/**
 * Response type for createUser
 */
export type CreateUserResponse = any; // UserResponseDto;

/**
 * Response type for updateUser
 */
export type UpdateUserResponse = any; // UserResponseDto;
