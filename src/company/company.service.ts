import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import CreateCompanyDto from './dto/create-company.dto';
import { QueryMetadataDto } from 'src/utils';

@Injectable()
export class CompanyService {
  constructor(private readonly prismaService: PrismaService) {}

  async getCompanies(query: QueryMetadataDto) {
    const { page = 1, limit = 10, search, filter } = query;
    const skip = query.getSkip();
    const sortObj = query.getSortObject();

    // Base query conditions
    const whereConditions: any = {};

    // Apply search if provided
    if (search) {
      whereConditions.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nameEn: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Apply additional filters if provided
    if (filter) {
      if (filter.industry) {
        whereConditions.industries = { has: filter.industry };
      }
      // Add more filters as needed
    }

    // Get total count
    const total = await this.prismaService.company.count({
      where: whereConditions,
    });

    // Get paginated data
    const data = await this.prismaService.company.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: sortObj || { createdAt: 'desc' },
      include: {
        user: true,
        companyRevenue: {
          orderBy: {
            year: 'desc',
          },
        },
      },
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext,
        hasPrevious,
      },
    };
  }

  async getAl(industry: string) {
    try {
      const whereClause = industry ? { industries: { has: industry } } : {};
      return await this.prismaService.company.findMany({
        where: whereClause,
        include: {
          user: true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to get companies: ${error.message}`);
    }
  }

  async getByUserId(userId: string) {
    try {
      const company = await this.prismaService.company.findUnique({
        where: {
          userId,
        },
      });

      if (!company) {
        throw new NotFoundException(`Company for user ID ${userId} not found`);
      }

      return company;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to get company by user ID: ${error.message}`);
    }
  }

  async create(data: CreateCompanyDto) {
    try {
      const company = await this.prismaService.company.create({ data });
      return company;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new NotFoundException(
          `Company with Juristic ID ${data.juristicId} already exists`,
        );
      }
      throw error;
    }
  }

  async update(id: string, data: CreateCompanyDto) {
    const company = await this.prismaService.company.findUnique({
      where: { id },
    });
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return this.prismaService.company.update({ where: { id }, data });
  }
  async updateByJuristic(id: string, data: CreateCompanyDto) {
    const company = await this.prismaService.company.findUnique({
      where: { juristicId: id },
    });
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return this.prismaService.company.update({
      where: { juristicId: id },
      data,
    });
  }

  async getById(id: string) {
    const company = await this.prismaService.company.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return company;
  }

  async getByJuristicId(juristicId: string) {
    const company = await this.prismaService.company.findUnique({
      where: {
        juristicId,
      },
      include: {
        companyRevenue: {
          orderBy: {
            year: 'desc',
          },
        },
      },
    });
    if (!company) {
      throw new NotFoundException(
        `Company with Juristic ID ${juristicId} not found`,
      );
    }
    return company;
  }
}
