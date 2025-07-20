import { User, Company, Freelance } from 'generated/prisma';
import { ResponseMetadata } from 'src/utils';

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
 * User with all industry relations (for getAllUsers)
 */
export interface UserWithIndustryRelations extends User {
  company: {
    id: string;
    nameTh: string;
    nameEn: string;
    juristicId: string;
  } | null;
  freelance: {
    id: string;
    firstNameTh: string;
    lastNameTh: string;
    firstNameEn: string;
    lastNameEn: string;
    juristicId: string;
  } | null;
  industryTags: Array<{
    tag: {
      name: string;
      slug: string;
      industry: {
        name: string;
        slug: string;
      };
    };
  }>;
  industryChannels: Array<{
    channel: {
      name: string;
      slug: string;
      industry: {
        name: string;
        slug: string;
      };
    };
  }>;
  industrySkills: Array<{
    skill: {
      title: string;
      slug: string;
      industry: {
        name: string;
        slug: string;
      };
    };
  }>;
  industriesRelated: Array<{
    industry: any;
  }>;
}

/**
 * User with detailed relations (for getUserById)
 */
export interface UserWithDetailedRelations extends User {
  company: Company | null;
  freelance: Freelance | null;
  industryTags: Array<{
    tag: any;
  }>;
  industryChannels: Array<{
    channel: any;
  }>;
  industrySkills: Array<{
    skill: any;
  }>;
  industriesRelated: Array<{
    industry: any;
  }>;
}

/**
 * User with revenue relations (for getMe and getUserByEmail)
 */
export interface UserWithRevenueRelations extends User {
  company:
    | (Company & {
        companyRevenue: any[];
      })
    | null;
  freelance:
    | (Freelance & {
        freelanceRevenue: any[];
      })
    | null;
  industryTags: Array<{
    tag: {
      name: string;
      slug: string;
      industry: {
        name: string;
        slug: string;
      };
    };
  }>;
  industryChannels: Array<{
    channel: {
      name: string;
      slug: string;
      industry: {
        name: string;
        slug: string;
      };
    };
  }>;
  industrySkills: Array<{
    skill: {
      title: string;
      slug: string;
      industry: {
        name: string;
        slug: string;
      };
    };
  }>;
  industriesRelated: Array<{
    industry: any;
  }>;
}

/**
 * Transformed user response (for getMe)
 */
export interface TransformedUserResponse {
  industryTags: Array<{
    name: string;
    slug: string;
    industry: {
      name: string;
      slug: string;
    };
  }>;
  industryChannels: Array<{
    name: string;
    slug: string;
    industry: {
      name: string;
      slug: string;
    };
  }>;
  industrySkills: Array<{
    title: string;
    slug: string;
    industry: {
      name: string;
      slug: string;
    };
  }>;
  [key: string]: any; // for other user properties
}

/**
 * Response for paginated users
 */
export type GetAllUsersResponse = ResponseMetadata<UserWithIndustryRelations[]>;
