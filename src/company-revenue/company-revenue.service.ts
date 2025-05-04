import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCompanyRevenueDto } from './dto/create-company-revenue.dto';

@Injectable()
export class CompanyRevenueService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    return this.prismaService.companyRevenue.findMany();
  }

  async getByCompanyId(companyId: string) {
    return this.prismaService.companyRevenue.findMany({
      where: {
        companyId,
      },
    });
  }

  async create(data: CreateCompanyRevenueDto) {
    return this.prismaService.companyRevenue.upsert({
      create: data,
      update: data,
      where: {
        companyId_year: {
          companyId: data.companyId,
          year: data.year,
        },
      },
    });
  }
}
