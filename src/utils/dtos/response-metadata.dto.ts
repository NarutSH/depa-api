import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetadata {
  @ApiProperty({ description: 'Current page number (1-based)' })
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit: number;

  @ApiProperty({ description: 'Total number of items available' })
  total: number;

  @ApiProperty({ description: 'Total number of pages' })
  pageCount: number;

  @ApiProperty({ description: 'Has next page' })
  hasNextPage: boolean;

  @ApiProperty({ description: 'Has previous page' })
  hasPreviousPage: boolean;

  constructor(page: number, limit: number, total: number) {
    this.page = page;
    this.limit = limit;
    this.total = total;
    this.pageCount = Math.ceil(total / limit);
    this.hasNextPage = page < this.pageCount;
    this.hasPreviousPage = page > 1;
  }
}

export class ResponseMetadata<T> {
  @ApiProperty({ description: 'Data returned from the request' })
  data: T;

  @ApiProperty({
    description: 'Pagination information',
    type: PaginationMetadata,
  })
  meta?: PaginationMetadata;

  @ApiProperty({ description: 'Request success status', default: true })
  success: boolean;

  @ApiProperty({ description: 'Optional message', required: false })
  message?: string;

  constructor(data: T, meta?: PaginationMetadata, message?: string) {
    this.data = data;
    this.meta = meta;
    this.success = true;
    this.message = message;
  }

  static success<T>(
    data: T,
    meta?: PaginationMetadata,
    message?: string,
  ): ResponseMetadata<T> {
    return new ResponseMetadata<T>(data, meta, message);
  }

  static paginated<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
    message?: string,
  ): ResponseMetadata<T[]> {
    const meta = new PaginationMetadata(page, limit, total);
    return new ResponseMetadata<T[]>(data, meta, message);
  }
}
