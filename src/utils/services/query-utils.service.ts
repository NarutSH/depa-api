import { Injectable } from '@nestjs/common';
import { QueryMetadataDto } from '../dtos/query-metadata.dto';

@Injectable()
export class QueryUtilsService {
  /**
   * Builds a Prisma-compatible where clause from query metadata
   * @param queryDto Query metadata with filter and search parameters
   * @param searchFields Fields to search in when a search term is provided
   * @returns Prisma-compatible where clause
   */
  buildWhereClause(
    queryDto: QueryMetadataDto,
    searchFields: string[] = [],
  ): any {
    const whereConditions: any[] = [];

    // Handle filters
    if (queryDto.filter && Object.keys(queryDto.filter).length > 0) {
      const filterCondition = this.processFilters(queryDto.filter);
      if (filterCondition) {
        whereConditions.push(filterCondition);
      }
    }

    // Handle search term
    if (queryDto.search && searchFields.length > 0) {
      const searchCondition = this.buildSearchCondition(
        queryDto.search,
        searchFields,
      );
      if (searchCondition) {
        whereConditions.push(searchCondition);
      }
    }

    // Combine all conditions with AND
    if (whereConditions.length > 0) {
      return { AND: whereConditions };
    }

    return {};
  }

  /**
   * Process filter object into Prisma-compatible conditions
   */
  private processFilters(filters: Record<string, any>): any {
    const conditions = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return;
      }

      // Handle arrays for IN conditions
      if (Array.isArray(value)) {
        conditions[key] = { in: value };
        return;
      }

      // Handle objects for range conditions or complex filters
      if (typeof value === 'object') {
        const complexCondition = this.processComplexFilter(key, value);
        if (complexCondition) {
          Object.assign(conditions, complexCondition);
        }
        return;
      }

      // Simple equality
      conditions[key] = value;
    });

    return Object.keys(conditions).length > 0 ? conditions : null;
  }

  /**
   * Process complex filter conditions like ranges
   */
  private processComplexFilter(
    field: string,
    condition: Record<string, any>,
  ): any {
    const result = {};
    const fieldCondition = {};

    // Process operators like gt, lt, gte, lte, etc.
    for (const [operator, value] of Object.entries(condition)) {
      switch (operator) {
        case 'gt':
        case 'gte':
        case 'lt':
        case 'lte':
        case 'equals':
        case 'not':
        case 'contains':
        case 'startsWith':
        case 'endsWith':
          fieldCondition[operator] = value;
          break;
        default:
          // For custom operators or nested filters
          break;
      }
    }

    if (Object.keys(fieldCondition).length > 0) {
      result[field] = fieldCondition;
    }

    return result;
  }

  /**
   * Build search condition for Prisma
   */
  private buildSearchCondition(
    searchTerm: string,
    searchFields: string[],
  ): any {
    if (!searchTerm || !searchFields.length) {
      return null;
    }

    const searchConditions = searchFields.map((field) => ({
      [field]: {
        contains: searchTerm,
        mode: 'insensitive', // Case insensitive search
      },
    }));

    return { OR: searchConditions };
  }

  /**
   * Builds a Prisma-compatible orderBy object from sort parameter
   */
  buildOrderByClause(
    queryDto: QueryMetadataDto,
    defaultSort?: { [key: string]: 'asc' | 'desc' },
  ): any {
    // Handle case where getSortObject might not exist or queryDto is just a plain object
    if (queryDto.sort) {
      const [field, direction] = queryDto.sort.split(':');
      if (field) {
        return { [field]: (direction || 'asc') as 'asc' | 'desc' };
      }
    }

    // If getSortObject exists and returns a value, use it (for backward compatibility)
    if (typeof queryDto.getSortObject === 'function') {
      const sortObj = queryDto.getSortObject();
      if (sortObj) {
        return sortObj;
      }
    }

    return defaultSort || { createdAt: 'desc' }; // Default sort if none specified
  }
}
