import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFreelanceDto } from './dto/create-freelance.dto';

@Injectable()
export class FreelanceService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateFreelanceDto) {
    try {
      const company = await this.prismaService.freelance.create({
        data,
      });
      return company;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new NotFoundException(`already exists`);
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
}
