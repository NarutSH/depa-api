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
import {
  CreateCommentResponse,
  DeleteCommentResponse,
  GetAllCommentsResponse,
  UpdateCommentResponse,
} from './types/comment.types';

@Injectable()
export class PortfolioService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly queryUtils: QueryUtilsService,
  ) {}

  async getAllPortfolios(queryDto?: QueryMetadataDto) {
    // Define searchable fields for portfolios
    const searchableFields = ['title', 'description', 'tags'];

    // Build where clause for filtering and searching
    const where = await (queryDto
      ? this.queryUtils.buildWhereClause(queryDto, searchableFields)
      : {});

    // Build orderBy clause for sorting
    const orderBy = await (queryDto
      ? this.queryUtils.buildOrderByClause(queryDto, { createdAt: 'desc' })
      : { createdAt: 'desc' });

    // Execute the query without pagination
    const portfolios = await this.prismaService.portfolio.findMany({
      where,
      orderBy,
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
    });

    // Transform the data if needed (like handling nested objects or arrays)
    const transformedPortfolios = portfolios.map((portfolio) => ({
      ...portfolio,
      standards: portfolio.standards.map((s) => s.standards),
    }));

    return {
      data: transformedPortfolios,
      message: 'All portfolios retrieved successfully',
    };
  }

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
    console.log('industrySlug', industrySlug);
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
            user: {
              include: {
                industriesRelated: true,
                industryChannels: true,
                industrySkills: true,
                industryTags: true,
              },
            },
          },
        },
        freelance: {
          include: {
            user: {
              include: {
                industriesRelated: true,
                industryChannels: true,
                industrySkills: true,
                industryTags: true,
              },
            },
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

  async createPortfolio(
    data: CreatePortfolioDto & {
      industryTags?: string[];
      industryLookingFor?: string[];
    },
  ) {
    if (!data.freelanceId && !data.companyJuristicId) {
      throw new NotFoundException(
        'Freelance ID or Company Juristic ID is required',
      );
    } else if (data.freelanceId && data.companyJuristicId) {
      throw new NotFoundException(
        'Freelance ID and Company Juristic ID cannot be used together',
      );
    }

    // Destructure to remove join-table fields
    const { industryTags, industryLookingFor, ...rest } = data;
    const makeData = {
      ...rest,
      tags: Array.isArray(rest.tags) ? rest.tags : [rest.tags],
      looking_for: Array.isArray(rest.looking_for)
        ? rest.looking_for
        : [rest.looking_for],
    };

    // Create portfolio first
    const portfolio = await this.prismaService.portfolio.create({
      data: makeData,
    });

    // Handle industryTags (projectTagSlug)
    if (industryTags && industryTags.length) {
      await this.prismaService.portfolioTag.createMany({
        data: industryTags.map((projectTagSlug) => ({
          portfolioId: portfolio.id,
          projectTagSlug,
        })),
        skipDuplicates: true,
      });
    }

    // Handle industryLookingFor (lookingForSlug)
    if (industryLookingFor && industryLookingFor.length) {
      await this.prismaService.portfolioLookingFor.createMany({
        data: industryLookingFor.map((lookingForSlug) => ({
          portfolioId: portfolio.id,
          lookingForSlug,
        })),
        skipDuplicates: true,
      });
    }

    return portfolio;
  }

  async addStandardsToPortfolio(portfolioId: string, standardIds: string[]) {
    // Remove duplicate standardIds to avoid unique constraint error
    const uniqueStandardIds = Array.from(new Set(standardIds));
    const result = await this.prismaService.portfolioStandards.createMany({
      data: uniqueStandardIds.map((id) => ({
        portfolioId,
        standardsId: id,
      })),
      skipDuplicates: true,
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

  async createComment(
    userId: string,
    data: CreateCommentDto,
  ): Promise<CreateCommentResponse> {
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

    const createdComment = await this.prismaService.portfolioComment.create({
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

    return {
      data: createdComment,
      message: 'Comment created',
    };
  }

  async getPortfolioComments(
    portfolioId: string,
  ): Promise<GetAllCommentsResponse> {
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

    return {
      data: comments,
      message: 'Comments retrieved successfully',
    };
  }

  async updateComment(
    id: string,
    userId: string,
    content: string,
  ): Promise<UpdateCommentResponse> {
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

    const updatedComment = await this.prismaService.portfolioComment.update({
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

    return {
      data: updatedComment,
      message: 'Comment updated successfully',
    };
  }

  async deleteComment(
    id: string,
    userId: string,
    userType: string,
  ): Promise<DeleteCommentResponse> {
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
      await this.prismaService.portfolioComment.delete({
        where: { id },
      });

      return {
        message: 'Comment deleted successfully',
      };
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

    await this.prismaService.portfolioComment.delete({
      where: { id },
    });

    return {
      message: 'Comment deleted successfully',
    };
  }

  async updatePortfolio(
    id: string,
    data: any & {
      industryTags?: string[];
      industryLookingFor?: string[];
      standards?: string[];
    },
  ) {
    const portfolio = await this.prismaService.portfolio.findUnique({
      where: { id },
    });
    if (!portfolio) {
      throw new NotFoundException(`Portfolio with id ${id} not found`);
    }
    // Destructure to remove join-table fields
    const { industryTags, industryLookingFor, standards, ...rest } = data;
    delete rest.id;
    delete rest.companyJuristicId;
    delete rest.freelanceId;
    delete rest.standards; // Ensure standards is not sent to Prisma
    const updated = await this.prismaService.portfolio.update({
      where: { id },
      data: {
        ...rest,
        tags: Array.isArray(rest.tags) ? rest.tags : [rest.tags],
        looking_for: Array.isArray(rest.looking_for)
          ? rest.looking_for
          : [rest.looking_for],
      },
    });

    // Update industryTags (PortfolioTag)
    if (industryTags) {
      await this.prismaService.portfolioTag.deleteMany({
        where: { portfolioId: id },
      });
      if (industryTags.length) {
        await this.prismaService.portfolioTag.createMany({
          data: industryTags.map((projectTagSlug) => ({
            portfolioId: id,
            projectTagSlug,
          })),
          skipDuplicates: true,
        });
      }
    }

    // Update industryLookingFor (PortfolioLookingFor)
    if (industryLookingFor) {
      await this.prismaService.portfolioLookingFor.deleteMany({
        where: { portfolioId: id },
      });
      if (industryLookingFor.length) {
        await this.prismaService.portfolioLookingFor.createMany({
          data: industryLookingFor.map((lookingForSlug) => ({
            portfolioId: id,
            lookingForSlug,
          })),
          skipDuplicates: true,
        });
      }
    }

    // Update standards (PortfolioStandards)
    if (standards) {
      await this.prismaService.portfolioStandards.deleteMany({
        where: { portfolioId: id },
      });
      if (standards.length) {
        await this.addStandardsToPortfolio(id, standards);
      }
    }

    return updated;
  }

  async replaceImagesForPortfolio(
    portfolioId: string,
    imagePaths: string[],
    type: PortfolioImageType,
  ) {
    // Delete existing images of this type for the portfolio
    await this.prismaService.portfolioImage.deleteMany({
      where: { portfolioId, type },
    });
    // Add new images
    if (imagePaths.length) {
      await this.prismaService.portfolioImage.createMany({
        data: imagePaths.map((path) => ({
          portfolioId,
          url: path,
          type,
        })),
      });
    }
  }

  async getPortfolioRandom(limit: number) {
    try {
      console.log('Getting random portfolios with limit:', limit);
      // Get total count
      const total = await this.prismaService.portfolio.count();
      if (total === 0) return [];
      // If less than limit, just return all
      if (total <= limit) {
        return this.prismaService.portfolio.findMany({
          take: limit,
        });
      }
      // Get random skip positions
      const maxSkip = Math.max(0, total - limit);
      const skip = Math.floor(Math.random() * (maxSkip + 1));

      console.log('Random skip:', skip, 'Limit:', limit);
      return this.prismaService.portfolio.findMany({
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
      });
    } catch (error) {
      console.log('===>', error);
      throw error;
    }
  }
}
