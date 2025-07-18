import { Company, CompanyRevenue, User } from 'generated/prisma';

/**
 * Company entity with its related user and revenue data
 */
export interface CompanyWithRelations extends Company {
  user: User;
  companyRevenue: CompanyRevenue[];
}

/**
 * Company entity with user relation (for getById)
 */
export interface CompanyWithUser extends Company {
  user: User;
}

/**
 * Company entity with revenue relation (for getByJuristicId)
 */
export interface CompanyWithRevenue extends Company {
  companyRevenue: CompanyRevenue[];
}

/**
 * Company entity with extended user relations (for getAll)
 */
export interface CompanyWithExtendedUser extends Company {
  user: User & {
    industriesRelated: any[];
    industryChannels: any[];
    industrySkills: any[];
    industryTags: any[];
  };
}

/**
 * Pagination metadata for paginated responses
 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Response interface for the getCompanies method
 * Contains paginated company data with metadata
 */
export interface GetCompaniesResponse {
  data: CompanyWithRelations[];
  meta: PaginationMeta;
}
