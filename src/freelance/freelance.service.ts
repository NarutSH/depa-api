import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFreelanceDto } from './dto/create-freelance.dto';
import { UpdateFreelanceDto } from './dto/update-freelance.dto';
import { QueryMetadataDto, ResponseMetadata } from 'src/utils';
import { QueryUtilsService } from 'src/utils/services/query-utils.service';
import {
  FreelanceListResponseDto,
  FreelanceResponseDto,
  FreelanceWithPortfolioResponseDto,
  FreelanceWithUserResponseDto,
} from './dto/freelance-response.dto';

@Injectable()
export class FreelanceService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly queryUtils: QueryUtilsService,
  ) {}

  async getFreelances(
    queryDto: QueryMetadataDto,
  ): Promise<FreelanceListResponseDto> {
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
    const where: any = this.queryUtils.buildWhereClause(
      queryDto,
      searchableFields,
    );

    // Apply additional filters if provided
    const filter = queryDto.filter;
    if (filter) {
      // Filter by user.industryTags.tagSlug (nested relation, support multiple tags)
      if (filter.tags) {
        const tagsArray = Array.isArray(filter.tags)
          ? filter.tags
          : [filter.tags];
        if (!where.user) where.user = {};
        where.user.industryTags = {
          some: {
            tagSlug: { in: tagsArray },
          },
        };
      }

      // Filter by user.industryChannels.channelSlug (nested relation, support multiple channels)
      if (filter.channel) {
        const channelArray = Array.isArray(filter.channel)
          ? filter.channel
          : [filter.channel];
        if (!where.user) where.user = {};
        where.user.industryChannels = {
          some: {
            channelSlug: { in: channelArray },
          },
        };
      }

      // Filter by freelance.skills[] (array of string, support multiple skills)
      if (filter.skill) {
        const skillArray = Array.isArray(filter.skill)
          ? filter.skill
          : [filter.skill];
        where.skills = { hasSome: skillArray };
      }
    }

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
              role: true,
              createdAt: true,
              updatedAt: true,
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
    const response = ResponseMetadata.paginated(
      freelances as FreelanceWithPortfolioResponseDto[],
      total,
      page,
      limit,
      'Freelances retrieved successfully',
    );

    return {
      ...response,
      meta: {
        total: response.meta.total,
        page: response.meta.page,
        limit: response.meta.limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrevious: page > 1,
      },
    } as FreelanceListResponseDto;
  }

  async getAl(industry: string): Promise<FreelanceWithPortfolioResponseDto[]> {
    try {
      const freelances = await this.prismaService.freelance.findMany({
        where: industry ? { industryTypes: { has: industry } } : {},
        include: {
          user: {
            select: {
              id: true,
              fullnameTh: true,
              fullnameEn: true,
              email: true,
              image: true,
              role: true,
              createdAt: true,
              updatedAt: true,
              tags: true,
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
      });

      return freelances as FreelanceWithPortfolioResponseDto[];
    } catch (error) {
      console.error('Error fetching freelancers:', error);
      if (error.code === 'P2023') {
        throw new NotFoundException('Invalid data format in query');
      }
      throw error;
    }
  }

  async create(data: CreateFreelanceDto): Promise<FreelanceResponseDto> {
    try {
      const freelance = await this.prismaService.freelance.create({
        data,
      });
      return freelance as FreelanceResponseDto;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new NotFoundException(error);
      }
      throw error;
    }
  }

  async getByUserId(userId: string): Promise<FreelanceWithUserResponseDto> {
    const freelance = await this.prismaService.freelance.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            fullnameTh: true,
            fullnameEn: true,
            email: true,
            image: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            tags: true,
          },
        },
      },
    });
    if (!freelance) {
      throw new NotFoundException(`Freelance with userId ${userId} not found`);
    }
    return freelance as FreelanceWithUserResponseDto;
  }

  async getById(id: string): Promise<FreelanceWithPortfolioResponseDto> {
    const freelance = await this.prismaService.freelance.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            id: true,
            fullnameTh: true,
            fullnameEn: true,
            email: true,
            image: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            tags: true,
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
    });
    if (!freelance) {
      throw new NotFoundException(`Freelance with ${id} not found`);
    }
    return freelance as FreelanceWithPortfolioResponseDto;
  }

  async getByJuristicId(
    juristicId: string,
  ): Promise<FreelanceWithUserResponseDto> {
    const freelance = await this.prismaService.freelance.findUnique({
      where: { juristicId },
      include: {
        user: {
          select: {
            id: true,
            fullnameTh: true,
            fullnameEn: true,
            email: true,
            image: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            tags: true,
          },
        },
      },
    });
    if (!freelance) {
      throw new NotFoundException(
        `Freelance with juristicId ${juristicId} not found`,
      );
    }
    return freelance as FreelanceWithUserResponseDto;
  }

  async update(
    freelanceId: string,
    data: UpdateFreelanceDto,
  ): Promise<FreelanceResponseDto> {
    try {
      const updatedFreelance = await this.prismaService.freelance.update({
        where: { id: freelanceId },
        data,
      });
      return updatedFreelance as FreelanceResponseDto;
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
