import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LookingForService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.lookingFor.create({ data });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
  }) {
    return this.prisma.lookingFor.findMany({
      skip: params?.skip,
      take: params?.take,
      where: params?.where,
      orderBy: params?.orderBy,
    });
  }

  async findOne(id: string) {
    const found = await this.prisma.lookingFor.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('LookingFor not found');
    return found;
  }

  async update(id: string, data: any) {
    return this.prisma.lookingFor.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.lookingFor.delete({ where: { id } });
  }
}
