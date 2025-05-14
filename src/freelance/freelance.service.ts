import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFreelanceDto } from './dto/create-freelance.dto';
import { QueryMetadataDto, ResponseMetadata } from 'src/utils';
import { QueryUtilsService } from 'src/utils/services/query-utils.service';

@Injectable()
export class FreelanceService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly queryUtils: QueryUtilsService,
  ) {}

  async getFreelances(queryDto: QueryMetadataDto) {
    // Ensure we have valid pagination values
    const page = Number(queryDto.page) || 1;
    const limit = Number(queryDto.limit) || 10;
    const skip = (page - 1) * limit;

    // Define searchable fields for freelances
    const searchableFields = [
      'firstNameTh',
      'lastNameTh',
      'firstNameEn',
      'lastNameEn',
      'email',
    ];

    // Build where clause for filtering and searching
    const where = this.queryUtils.buildWhereClause(queryDto, searchableFields);

    // Build orderBy clause for sorting
    const orderBy = this.queryUtils.buildOrderByClause(queryDto, {
      createdAt: 'desc',
    });

    // Execute the query with pagination
    const [freelances, total] = await Promise.all([
      this.prismaService.freelance.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              fullnameTh: true,
              fullnameEn: true,
              email: true,
              image: true,
              tags: true,
              industryTags: {
                include: {
                  tag: true,
                },
              },
              industrySkills: {
                include: {
                  skill: true,
                },
              },
            },
          },
          Portfolio: {
            include: {
              Image: {
                select: {
                  url: true,
                  type: true,
                  description: true,
                },
              },
            },
          },
        },
      }),
      this.prismaService.freelance.count({ where }),
    ]);

    // Return paginated response with metadata
    return ResponseMetadata.paginated(
      freelances,
      total,
      page,
      limit,
      'Freelances retrieved successfully',
    );
  }

  async getAl(industry: string) {
    try {
      return await this.prismaService.freelance.findMany({
        where: industry ? { industryTypes: { has: industry } } : {},
        include: {
          user: true,
        },
      });
    } catch (error) {
      console.error('Error fetching freelancers:', error);
      if (error.code === 'P2023') {
        throw new NotFoundException('Invalid data format in query');
      }
      throw error;
    }
  }

  async create(data: CreateFreelanceDto) {
    try {
      const company = await this.prismaService.freelance.create({
        data,
      });
      return company;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new NotFoundException(error);
      }
      throw error;
    }
  }

  async getByUserId(userId: string) {
    const freelance = await this.prismaService.freelance.findUnique({
      where: { userId },
    });
    if (!freelance) {
      throw new NotFoundException(`Freelance with userId ${userId} not found`);
    }
    return freelance;
  }

  async getById(id: string) {
    const freelance = await this.prismaService.freelance.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });
    if (!freelance) {
      throw new NotFoundException(`Freelance with ${id} not found`);
    }
    return freelance;
  }

  async getByJuristicId(juristicId: string) {
    const freelance = await this.prismaService.freelance.findUnique({
      where: { juristicId },
    });
    if (!freelance) {
      throw new NotFoundException(
        `Freelance with juristicId ${juristicId} not found`,
      );
    }
    return freelance;
  }

  async update(freelanceId: string, data: Partial<CreateFreelanceDto>) {
    try {
      const updatedFreelance = await this.prismaService.freelance.update({
        where: { id: freelanceId },
        data,
      });
      return updatedFreelance;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Freelance with userId ${freelanceId} not found`,
        );
      }
      throw error;
    }
  }
}
