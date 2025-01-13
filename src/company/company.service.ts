import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import CreateCompanyDto from './dto/create-company.dto';

@Injectable()
export class CompanyService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAl() {
    return this.prismaService.company.findMany();
  }

  async getByUserId(userId: string) {
    return this.prismaService.company.findUnique({
      where: {
        userId,
      },
    });
  }

  async create(data: CreateCompanyDto) {
    console.log('data', data);

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
