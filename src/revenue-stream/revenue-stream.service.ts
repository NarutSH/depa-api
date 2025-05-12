import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryMetadataDto } from 'src/utils/dtos/query-metadata.dto';
import { QueryUtilsService } from 'src/utils/services/query-utils.service';
import { CreateRevenueStreamDto } from './dto/create-revenue-stream.dto';
import { UpdateRevenueStreamDto } from './dto/update-revenue-stream.dto';
import { UpdateRevenueValueDto } from './dto/update-revenue-value.dto';

@Injectable()
export class RevenueStreamService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly queryUtilsService: QueryUtilsService,
  ) {}

  /**
   * Get all revenue streams with optional filtering, pagination, and sorting
   */
  async getAll(query?: QueryMetadataDto) {
    // Define searchable fields
    const searchFields = [
      'industryTypeSlug',
      'categorySlug',
      'sourceSlug',
      'channelSlug',
      'segmentSlug',
    ];

    // Build query parameters
    const where = query
      ? this.queryUtilsService.buildWhereClause(query, searchFields)
      : {};
    const orderBy = query
      ? this.queryUtilsService.buildOrderByClause(query)
      : { createdAt: 'desc' };
    const skip = query?.getSkip() || 0;
    const take = query?.limit || 10;

    // Get total count for pagination
    const totalCount = await this.prismaService.revenueStream.count({ where });

    // Get data with pagination
    const data = await this.prismaService.revenueStream.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        industry: true,
        category: true,
        source: true,
        channel: true,
        segment: true,
        company: {
          select: {
            id: true,
            juristicId: true,
            nameTh: true,
            nameEn: true,
          },
        },
      },
    });

    // Return paginated result
    return {
      data,
      meta: {
        total: totalCount,
        page: query?.page || 1,
        limit: query?.limit || 10,
        totalPages: Math.ceil(totalCount / (query?.limit || 10)),
      },
    };
  }

  /**
   * Get revenue streams by company ID with optional filtering, pagination, and sorting
   */
  async getByCompanyId(companyJuristicId: string, query?: QueryMetadataDto) {
    // Find company ID first
    const company = await this.prismaService.company.findUnique({
      where: { juristicId: companyJuristicId },
      select: { id: true },
    });

    if (!company) {
      throw new NotFoundException(
        `Company with juristic ID ${companyJuristicId} not found`,
      );
    }

    // Define searchable fields
    const searchFields = [
      'industryTypeSlug',
      'categorySlug',
      'sourceSlug',
      'channelSlug',
      'segmentSlug',
    ];

    // Build base query with company filter
    const baseFilter = { companyId: company.id };

    // Merge with additional filters from query
    const where = query
      ? {
          ...this.queryUtilsService.buildWhereClause(query, searchFields),
          ...baseFilter,
        }
      : baseFilter;

    const orderBy = query
      ? this.queryUtilsService.buildOrderByClause(query)
      : { createdAt: 'desc' };
    const skip = query?.getSkip() || 0;
    const take = query?.limit || 10;

    // Get total count for pagination
    const totalCount = await this.prismaService.revenueStream.count({ where });

    // Get data with pagination
    const data = await this.prismaService.revenueStream.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        industry: true,
        category: true,
        source: true,
        channel: true,
        segment: true,
        company: {
          select: {
            id: true,
            juristicId: true,
            nameTh: true,
            nameEn: true,
          },
        },
      },
    });

    // Return paginated result
    return {
      data,
      meta: {
        total: totalCount,
        page: query?.page || 1,
        limit: query?.limit || 10,
        totalPages: Math.ceil(totalCount / (query?.limit || 10)),
      },
    };
  }

  /**
   * Get revenue stream by ID
   */
  async getById(id: string) {
    const revenueStream = await this.prismaService.revenueStream.findUnique({
      where: { id },
      include: {
        industry: true,
        category: true,
        source: true,
        channel: true,
        segment: true,
        company: {
          select: {
            id: true,
            juristicId: true,
            nameTh: true,
            nameEn: true,
          },
        },
      },
    });

    if (!revenueStream) {
      throw new NotFoundException(`Revenue stream with ID ${id} not found`);
    }

    return revenueStream;
  }

  /**
   * Create a new revenue stream record
   */
  async create(data: CreateRevenueStreamDto) {
    try {
      // First get the company ID based on juristic ID
      const company = await this.prismaService.company.findUnique({
        where: { juristicId: data.companyJuristicId },
        select: { id: true },
      });

      if (!company) {
        throw new NotFoundException(
          `Company with juristic ID ${data.companyJuristicId} not found`,
        );
      }

      // Transform the DTO into the format Prisma expects
      const createData = {
        year: data.year,
        percent: data.percent,
        ctrPercent: data.ctrPercent,
        value: data.value,
        companyJuristicId: data.companyJuristicId,
        company: {
          connect: { id: company.id },
        },
        industry: {
          connect: { slug: data.industryTypeSlug },
        },
        category: {
          connect: {
            slug_industrySlug: {
              slug: data.categorySlug,
              industrySlug: data.industryTypeSlug,
            },
          },
        },
        source: {
          connect: {
            slug_industrySlug: {
              slug: data.sourceSlug,
              industrySlug: data.industryTypeSlug,
            },
          },
        },
        channel: {
          connect: {
            slug_industrySlug: {
              slug: data.channelSlug,
              industrySlug: data.industryTypeSlug,
            },
          },
        },
        segment: {
          connect: {
            slug_industrySlug: {
              slug: data.segmentSlug,
              industrySlug: data.industryTypeSlug,
            },
          },
        },
      };

      return this.prismaService.revenueStream.create({
        data: createData,
        include: {
          industry: true,
          category: true,
          source: true,
          channel: true,
          segment: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // Handle known Prisma errors
        if (error.code === 'P2002') {
          // Unique constraint violation, try upsert instead
          return this.upsertRevenueStream(data);
        }
      }
      throw error;
    }
  }

  /**
   * Create multiple revenue stream records
   */
  async createMany(data: CreateRevenueStreamDto[]) {
    const results = [];
    for (const item of data) {
      results.push(await this.upsertRevenueStream(item));
    }
    return results;
  }

  /**
   * Update a revenue stream record
   */
  async update(id: string, data: UpdateRevenueStreamDto) {
    const revenueStream = await this.prismaService.revenueStream.findUnique({
      where: { id },
    });

    if (!revenueStream) {
      throw new NotFoundException(`Revenue stream with ID ${id} not found`);
    }

    return this.prismaService.revenueStream.update({
      where: { id },
      data,
      include: {
        industry: true,
        category: true,
        source: true,
        channel: true,
        segment: true,
      },
    });
  }

  /**
   * Update the value of a revenue stream record
   * This is specialized for updating just the value field in a table cell
   */
  async updateValue(id: string, data: UpdateRevenueValueDto) {
    const revenueStream = await this.prismaService.revenueStream.findUnique({
      where: { id },
    });

    if (!revenueStream) {
      throw new NotFoundException(`Revenue stream with ID ${id} not found`);
    }

    return this.prismaService.revenueStream.update({
      where: { id },
      data: { value: data.value },
    });
  }

  /**
   * Delete a revenue stream record
   */
  async delete(id: string) {
    const revenueStream = await this.prismaService.revenueStream.findUnique({
      where: { id },
    });

    if (!revenueStream) {
      throw new NotFoundException(`Revenue stream with ID ${id} not found`);
    }

    return this.prismaService.revenueStream.delete({
      where: { id },
    });
  }

  /**
   * Upsert a revenue stream record (create if not exists, update if exists)
   */
  async upsertRevenueStream(data: CreateRevenueStreamDto) {
    // First get the company ID based on juristic ID
    const company = await this.prismaService.company.findUnique({
      where: { juristicId: data.companyJuristicId },
      select: { id: true },
    });

    if (!company) {
      throw new NotFoundException(
        `Company with juristic ID ${data.companyJuristicId} not found`,
      );
    }

    // Create data for Prisma - only include what's needed
    const createData = {
      year: data.year,
      percent: data.percent,
      ctrPercent: data.ctrPercent,
      value: data.value,
      companyJuristicId: data.companyJuristicId,
      // Don't include direct assignments for fields that will be set by relations
      company: {
        connect: { id: company.id },
      },
      industry: {
        connect: { slug: data.industryTypeSlug },
      },
      category: {
        connect: {
          slug_industrySlug: {
            slug: data.categorySlug,
            industrySlug: data.industryTypeSlug,
          },
        },
      },
      source: {
        connect: {
          slug_industrySlug: {
            slug: data.sourceSlug,
            industrySlug: data.industryTypeSlug,
          },
        },
      },
      channel: {
        connect: {
          slug_industrySlug: {
            slug: data.channelSlug,
            industrySlug: data.industryTypeSlug,
          },
        },
      },
      segment: {
        connect: {
          slug_industrySlug: {
            slug: data.segmentSlug,
            industrySlug: data.industryTypeSlug,
          },
        },
      },
    };

    // For update, we need a simpler object
    const updateData = {
      year: data.year,
      percent: data.percent,
      ctrPercent: data.ctrPercent,
      value: data.value,
    };

    return this.prismaService.revenueStream.upsert({
      where: {
        companyId_year_industryTypeSlug_categorySlug_sourceSlug_channelSlug_segmentSlug:
          {
            companyId: company.id,
            year: data.year,
            industryTypeSlug: data.industryTypeSlug,
            categorySlug: data.categorySlug,
            sourceSlug: data.sourceSlug,
            channelSlug: data.channelSlug,
            segmentSlug: data.segmentSlug,
          },
      },
      update: updateData,
      create: createData,
      include: {
        industry: true,
        category: true,
        source: true,
        channel: true,
        segment: true,
      },
    });
  }

  /**
   * Bulk update or create revenue stream records by value
   * This is specialized for updating values in a table interface
   */
  async bulkUpsertValues(items: UpdateRevenueValueDto[]) {
    const results = [];

    for (const item of items) {
      if (item.id) {
        // If ID exists, try to update existing record
        try {
          const result = await this.updateValue(item.id, { value: item.value });
          results.push(result);
        } catch (error) {
          if (error instanceof NotFoundException) {
            // If record not found but we have all required fields, create it
            if (this.hasRequiredFields(item)) {
              const newItem = this.mapValueDtoToCreateDto(item);
              const result = await this.create(newItem);
              results.push(result);
            } else {
              // Can't create without required fields
              throw error;
            }
          } else {
            throw error;
          }
        }
      } else if (this.hasRequiredFields(item)) {
        // No ID provided but we have all required fields, try to upsert
        const newItem = this.mapValueDtoToCreateDto(item);
        const result = await this.upsertRevenueStream(newItem);
        results.push(result);
      }
    }

    return results;
  }

  /**
   * Check if an update DTO has all required fields to create a new record
   */
  private hasRequiredFields(item: UpdateRevenueValueDto): boolean {
    return !!(
      item.companyJuristicId &&
      item.year !== undefined &&
      item.industryTypeSlug &&
      item.categorySlug &&
      item.sourceSlug &&
      item.channelSlug &&
      item.segmentSlug &&
      item.value !== undefined
    );
  }

  /**
   * Map from UpdateRevenueValueDto to CreateRevenueStreamDto
   */
  private mapValueDtoToCreateDto(
    item: UpdateRevenueValueDto,
  ): CreateRevenueStreamDto {
    return {
      companyJuristicId: item.companyJuristicId,
      year: item.year,
      industryTypeSlug: item.industryTypeSlug,
      categorySlug: item.categorySlug,
      sourceSlug: item.sourceSlug,
      channelSlug: item.channelSlug,
      segmentSlug: item.segmentSlug,
      percent: item.percent || 0, // Default to 0 if not provided
      ctrPercent: item.ctrPercent || 0, // Default to 0 if not provided
      value: item.value,
    };
  }
}
