import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FavoriteAction, PortfolioImageType } from 'generated/prisma';
import { QueryMetadataDto, ResponseMetadata } from 'src/utils';
import { QueryUtilsService } from 'src/utils/services/query-utils.service';

@Injectable()
export class PortfolioService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly queryUtils: QueryUtilsService,
  ) {}

  async getPortfolios(queryDto: QueryMetadataDto) {
    // Ensure we have valid pagination values
    const page = Number(queryDto.page) || 1;
    const limit = Number(queryDto.limit) || 10;
    const skip = (page - 1) * limit;

    // Define searchable fields for portfolios
    const searchableFields = ['title', 'description', 'tags'];

    // Build where clause for filtering and searching
    const where = this.queryUtils.buildWhereClause(queryDto, searchableFields);

    // Build orderBy clause for sorting
    const orderBy = this.queryUtils.buildOrderByClause(queryDto, {
      createdAt: 'desc',
    });

    // Execute the query with pagination
    const [portfolios, total] = await Promise.all([
      this.prismaService.portfolio.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          standards: {
            select: {
              standards: {
                select: {
                  name: true,
                  description: true,
                  type: true,
                  image: true,
                },
              },
            },
          },
          Image: {
            select: {
              url: true,
              type: true,
              description: true,
            },
          },
          company: {
            select: {
              juristicId: true,
              nameTh: true,
              nameEn: true,
              user: {
                select: {
                  fullnameTh: true,
                  fullnameEn: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
          freelance: {
            select: {
              id: true,
              user: {
                select: {
                  fullnameTh: true,
                  fullnameEn: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
        },
      }),
      this.prismaService.portfolio.count({ where }),
    ]);

    // Transform the data if needed (like handling nested objects or arrays)
    const transformedPortfolios = portfolios.map((portfolio) => ({
      ...portfolio,
      standards: portfolio.standards.map((s) => s.standards),
    }));

    // Return paginated response with metadata
    return ResponseMetadata.paginated(
      transformedPortfolios,
      total,
      page,
      limit,
      'Portfolios retrieved successfully',
    );
  }

  async getPortfolioById(id: string) {
    const model = await this.prismaService.portfolio.findUnique({
      where: { id },
      include: {
        standards: {
          select: {
            standards: {
              select: {
                name: true,
                description: true,
                type: true,
                image: true,
              },
            },
          },
        },
        Image: {
          select: {
            url: true,
            type: true,
            description: true,
          },
        },
        company: true,
        freelance: true,
      },
    });

    return {
      ...model,
      standards: model.standards.map((s) => s.standards),
    };
  }

  async getPortfolioByIndustry(industrySlug: string) {
    return this.prismaService.portfolio.findMany({
      where: {
        industryTypeSlug: industrySlug,
      },
      include: {
        standards: {
          select: {
            standards: {
              select: {
                name: true,
                description: true,
                type: true,
                image: true,
              },
            },
          },
        },
        Image: {
          select: {
            url: true,
            type: true,
            description: true,
          },
        },
        company: {
          include: {
            user: true,
          },
        },
        freelance: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async getPortfolioByCompanyJuristicId(companyJuristicId: string) {
    return this.prismaService.portfolio.findMany({
      where: { companyJuristicId },

      include: {
        standards: {
          select: {
            standards: {
              select: {
                name: true,
                description: true,
                type: true,
                image: true,
              },
            },
          },
        },
        company: true,
        Image: {
          select: {
            url: true,
            type: true,
            description: true,
          },
        },
      },
    });
  }
  async getPortfolioByFreelanceId(freelanceId: string) {
    return this.prismaService.portfolio.findMany({
      where: { freelanceId },

      include: {
        standards: {
          select: {
            standards: {
              select: {
                name: true,
                description: true,
                type: true,
                image: true,
              },
            },
          },
        },
        freelance: true,
        Image: {
          select: {
            url: true,
            type: true,
            description: true,
          },
        },
      },
    });
  }

  async createPortfolio(data: CreatePortfolioDto) {
    if (!data.freelanceId && !data.companyJuristicId) {
      throw new NotFoundException(
        'Freelance ID or Company Juristic ID is required',
      );
    } else if (data.freelanceId && data.companyJuristicId) {
      throw new NotFoundException(
        'Freelance ID and Company Juristic ID cannot be used together',
      );
    }

    console.log('createPortfolio', data);

    const makeData = {
      ...data,
      tags: Array.isArray(data.tags) ? data.tags : [data.tags],
      looking_for: Array.isArray(data.looking_for)
        ? data.looking_for
        : [data.looking_for],
      // standards: Array.isArray(data.standards)
      //   ? data.standards
      //   : [data.standards],
    };

    return this.prismaService.portfolio.create({ data: makeData });
  }

  async addStandardsToPortfolio(portfolioId: string, standardIds: string[]) {
    const result = await this.prismaService.portfolioStandards.createMany({
      data: standardIds.map((id) => ({
        portfolioId,
        standardsId: id,
      })),
    });

    return result;
  }

  async addImagesToPortfolio(
    portfolioId: string,
    imagePaths: string[],
    type: PortfolioImageType,
  ) {
    const result = await this.prismaService.portfolioImage.createMany({
      data: imagePaths.map((path) => ({
        portfolioId,
        url: path,
        type,
      })),
    });

    return result;
  }

  async deletePortfolio(id: string) {
    const portfolio = await this.prismaService.portfolio.findUnique({
      where: { id },
    });

    if (!portfolio) {
      throw new NotFoundException(`Portfolio with id ${id} not found`);
    }

    await this.prismaService.portfolioImage.deleteMany({
      where: { portfolioId: id },
    });
    await this.prismaService.portfolioStandards.deleteMany({
      where: { portfolioId: id },
    });
    return this.prismaService.portfolio.delete({ where: { id } });
  }

  async toggleFavorite(
    portfolioId: string,
    userId: string,
    action: FavoriteAction,
  ) {
    const portfolio = await this.prismaService.portfolio.findUnique({
      where: { id: portfolioId },
    });

    if (!portfolio) {
      throw new NotFoundException(`Portfolio with id ${portfolioId} not found`);
    }

    const existingFavorite = await this.prismaService.favorite.findUnique({
      where: {
        userId_portfolioId: {
          userId,
          portfolioId,
        },
      },
    });

    if (existingFavorite && existingFavorite.action === action) {
      return existingFavorite;
    }

    if (existingFavorite) {
      return this.prismaService.favorite.update({
        where: {
          userId_portfolioId: {
            userId,
            portfolioId,
          },
        },
        data: {
          action,
        },
      });
    }

    return this.prismaService.favorite.create({
      data: {
        portfolioId,
        userId,
        action,
      },
    });
  }

  async getFavoriteStatus(portfolioId: string, userId: string) {
    const favorite = await this.prismaService.favorite.findUnique({
      where: {
        userId_portfolioId: {
          userId,
          portfolioId,
        },
      },
    });

    return {
      portfolioId,
      userId,
      isFavorite: favorite?.action === FavoriteAction.favorite,
      action: favorite?.action || null,
    };
  }

  async getUserFavorites(userId: string) {
    const favorites = await this.prismaService.favorite.findMany({
      where: {
        userId,
        action: FavoriteAction.favorite,
      },
      include: {
        portfolio: {
          include: {
            standards: {
              select: {
                standards: {
                  select: {
                    name: true,
                    description: true,
                    type: true,
                    image: true,
                  },
                },
              },
            },
            Image: {
              select: {
                url: true,
                type: true,
                description: true,
              },
            },
            company: true,
            freelance: true,
          },
        },
      },
    });

    return favorites;
  }

  async createComment(userId: string, data: CreateCommentDto) {
    const portfolio = await this.prismaService.portfolio.findUnique({
      where: { id: data.portfolioId },
    });

    if (!portfolio) {
      throw new NotFoundException(
        `Portfolio with id ${data.portfolioId} not found`,
      );
    }

    if (data.parentId) {
      const parentComment =
        await this.prismaService.portfolioComment.findUnique({
          where: { id: data.parentId },
        });

      if (!parentComment) {
        throw new NotFoundException(
          `Parent comment with id ${data.parentId} not found`,
        );
      }

      if (parentComment.portfolioId !== data.portfolioId) {
        throw new ForbiddenException(
          'Parent comment does not belong to this portfolio',
        );
      }

      if (parentComment.parentId) {
        throw new ForbiddenException('Only one level of replies is allowed');
      }
    }

    return this.prismaService.portfolioComment.create({
      data: {
        content: data.content,
        portfolioId: data.portfolioId,
        userId,
        parentId: data.parentId,
      },
      include: {
        user: {
          select: {
            id: true,
            fullnameTh: true,
            fullnameEn: true,
            email: true,
            image: true,
            userType: true,
          },
        },
      },
    });
  }

  async getPortfolioComments(portfolioId: string) {
    const portfolio = await this.prismaService.portfolio.findUnique({
      where: { id: portfolioId },
    });

    if (!portfolio) {
      throw new NotFoundException(`Portfolio with id ${portfolioId} not found`);
    }

    const comments = await this.prismaService.portfolioComment.findMany({
      where: {
        portfolioId,
        parentId: null,
      },
      include: {
        user: {
          select: {
            id: true,
            fullnameTh: true,
            fullnameEn: true,
            email: true,
            image: true,
            userType: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                fullnameTh: true,
                fullnameEn: true,
                email: true,
                image: true,
                userType: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return comments;
  }

  async updateComment(id: string, userId: string, content: string) {
    const comment = await this.prismaService.portfolioComment.findUnique({
      where: { id },
      include: {
        portfolio: {
          include: {
            freelance: true,
            company: true,
          },
        },
      },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    return this.prismaService.portfolioComment.update({
      where: { id },
      data: { content },
      include: {
        user: {
          select: {
            id: true,
            fullnameTh: true,
            fullnameEn: true,
            email: true,
            image: true,
            userType: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                fullnameTh: true,
                fullnameEn: true,
                email: true,
                image: true,
                userType: true,
              },
            },
          },
        },
      },
    });
  }

  async deleteComment(id: string, userId: string, userType: string) {
    const comment = await this.prismaService.portfolioComment.findUnique({
      where: { id },
      include: {
        portfolio: {
          include: {
            freelance: true,
            company: true,
          },
        },
      },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }

    if (userType === 'admin') {
      return this.prismaService.portfolioComment.delete({
        where: { id },
      });
    }

    if (comment.userId !== userId) {
      const portfolio = comment.portfolio;
      const isOwner =
        (portfolio.freelanceId && portfolio.freelance?.userId === userId) ||
        (portfolio.companyJuristicId && portfolio.company?.userId === userId);

      if (!isOwner) {
        throw new ForbiddenException(
          'You can only delete your own comments or comments on your portfolio',
        );
      }
    }

    return this.prismaService.portfolioComment.delete({
      where: { id },
    });
  }
}
