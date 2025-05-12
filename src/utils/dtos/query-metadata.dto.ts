import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  Min,
  IsIn,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QueryMetadataDto {
  @ApiProperty({
    description: 'Page number (1-based)',
    required: false,
    default: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    default: 10,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({
    description: 'Search term that will be applied to configured fields',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description:
      'Field to sort by, with optional direction (e.g., "name:asc", "createdAt:desc")',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiProperty({
    description: 'Filter criteria in JSON format or as query parameters',
    required: false,
    type: Object,
  })
  @IsOptional()
  @IsObject()
  filter?: Record<string, any>;

  getSkip(): number {
    return (this.page - 1) * this.limit; // Adjusted for 1-based pagination
  }

  getSortObject(): { [key: string]: 'asc' | 'desc' } | undefined {
    if (!this.sort) return undefined;

    const [field, direction] = this.sort.split(':');
    return { [field]: (direction || 'asc') as 'asc' | 'desc' };
  }
}
