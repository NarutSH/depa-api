import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { PortfolioImageType } from '@prisma/client';

@Injectable()
export class PortfolioService {
  constructor(private readonly prismaService: PrismaService) {}

  async getPortfolios() {
    return this.prismaService.portfolio.findMany({
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
      },
    });
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
        company: true,
        freelance: true,
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

    const makeData = {
      ...data,
      tags: Array.isArray(data.tags) ? data.tags : [data.tags],
      looking_for: Array.isArray(data.looking_for)
        ? data.looking_for
        : [data.looking_for],
    };

    return this.prismaService.portfolio.create({ data: makeData });
  }

  async addStandardsToPortfolio(portfolioId: string, standardIds: string[]) {
    // console.log('standardIds====>', standardIds);

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
}
