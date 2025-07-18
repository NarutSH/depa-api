import { Channel } from 'generated/prisma';

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Response for paginated channels
 */
export interface GetAllChannelsResponse {
  data: Channel[];
  meta: PaginationMeta;
}
