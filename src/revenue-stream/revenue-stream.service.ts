import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRevenueStreamDto } from './dto/create-revenue-stream.dto';

@Injectable()
export class RevenueStreamService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    return this.prismaService.revenueStream.findMany();
  }
  async getByCompanyId(companyId: string) {
    console.log('getByCompanyId', companyId);

    return this.prismaService.revenueStream.findMany({
      where: {
        companyId,
      },
    });
  }

  async getById(id: string) {
    return this.prismaService.revenueStream.findUnique({ where: { id } });
  }

  async create(data: CreateRevenueStreamDto) {
    console.log('rev===>');
    // return this.prismaService.revenueStream.create({ data });

    return this.prismaService.revenueStream.upsert({
      create: data,
      update: data,
      where: {
        companyId_year_industryTypeSlug_categorySlug_sourceSlug_channelSlug_segment:
          {
            companyId: data.companyId,
            year: data.year,
            industryTypeSlug: data.industryTypeSlug,
            categorySlug: data.categorySlug,
            sourceSlug: data.sourceSlug,
            channelSlug: data.channelSlug,
            segment: data.segment,
          },
      },
    });
  }
}