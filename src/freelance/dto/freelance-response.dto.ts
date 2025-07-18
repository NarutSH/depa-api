import { Freelance, User } from 'generated/prisma';
import { ResponseMetadata } from 'src/utils';

/**
 * Freelance entity with basic user relation
 */
export interface FreelanceWithUser extends Freelance {
  user: User;
}

/**
 * Freelance entity with extended user relations (for getAl)
 */
export interface FreelanceWithExtendedUser extends Freelance {
  user: User & {
    industrySkills: any[];
    industriesRelated: any[];
    industryChannels: any[];
    industryTags: any[];
  };
}

/**
 * Freelance entity with detailed user and portfolio relations (for getFreelances)
 */
export interface FreelanceWithDetails extends Freelance {
  user: {
    id: string;
    fullnameTh: string;
    fullnameEn: string;
    email: string;
    image: string;
    tags: any;
    industryTags: Array<{
      tag: any;
    }>;
    industrySkills: Array<{
      skill: any;
    }>;
  };
  Portfolio: Array<{
    Image: Array<{
      url: string;
      type: string;
      description: string;
    }>;
  }>;
}

/**
 * Response interface for paginated freelances
 */
export type GetFreelancesResponse = ResponseMetadata<FreelanceWithDetails[]>;
