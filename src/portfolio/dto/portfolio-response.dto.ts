import { Portfolio, Company, Freelance, Favorite } from 'generated/prisma';
import { ResponseMetadata } from 'src/utils';

/**
 * Portfolio with company relation and basic includes
 */
export interface PortfolioWithCompanyRelations extends Portfolio {
  standards: Array<{
    standards: {
      name: string;
      description: string;
      type: string;
      image: string;
    };
  }>;
  company: Company;
  Image: Array<{
    url: string;
    type: string;
    description: string;
  }>;
}

/**
 * Portfolio with freelance relation and basic includes
 */
export interface PortfolioWithFreelanceRelations extends Portfolio {
  standards: Array<{
    standards: {
      name: string;
      description: string;
      type: string;
      image: string;
    };
  }>;
  freelance: Freelance;
  Image: Array<{
    url: string;
    type: string;
    description: string;
  }>;
}

/**
 * Portfolio with extended user relations (for getPortfolioByIndustry)
 */
export interface PortfolioWithExtendedRelations extends Portfolio {
  standards: Array<{
    standards: {
      name: string;
      description: string;
      type: string;
      image: string;
    };
  }>;
  Image: Array<{
    url: string;
    type: string;
    description: string;
  }>;
  company?: Company & {
    user: {
      industriesRelated: any[];
      industryChannels: any[];
      industrySkills: any[];
      industryTags: any[];
    };
  };
  freelance?: Freelance & {
    user: {
      industriesRelated: any[];
      industryChannels: any[];
      industrySkills: any[];
      industryTags: any[];
    };
  };
}

/**
 * Portfolio with detailed relations (for getPortfolioById)
 */
export interface PortfolioWithDetailedRelations extends Portfolio {
  standards: Array<{
    name: string;
    description: string;
    type: string;
    image: string;
  }>;
  Image: Array<{
    url: string;
    type: string;
    description: string;
  }>;
  company?: Company;
  freelance?: Freelance;
}

/**
 * Response for getAllPortfolios
 */
export interface GetAllPortfoliosResponse {
  data: PortfolioWithDetailedRelations[];
  message: string;
}

/**
 * Response for paginated portfolios
 */
export type GetPortfoliosResponse = ResponseMetadata<
  PortfolioWithDetailedRelations[]
>;

/**
 * Favorite status response
 */
export interface FavoriteStatusResponse {
  portfolioId: string;
  userId: string;
  isFavorite: boolean;
  action: string | null;
}

/**
 * User favorites response with portfolio details
 */
export interface UserFavorite extends Favorite {
  portfolio: PortfolioWithDetailedRelations;
}

/**
 * Batch operation result for images/standards
 */
export interface BatchCreateResult {
  count: number;
}
