import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindAllParams } from './dto/looking-for-response.dto';
import { CreateLookingForDto } from './dto/create-looking-for.dto';
import { UpdateLookingForDto } from './dto/update-looking-for.dto';
import { LookingFor } from 'generated/prisma';

@Injectable()
export class LookingForService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateLookingForDto): Promise<LookingFor> {
    return this.prisma.lookingFor.create({ data });
  }

  async findAll(params?: FindAllParams): Promise<LookingFor[]> {
    return this.prisma.lookingFor.findMany({
      skip: params?.skip,
      take: params?.take,
      where: params?.where,
      orderBy: params?.orderBy,
    });
  }

  async findOne(id: string): Promise<LookingFor> {
    const found = await this.prisma.lookingFor.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('LookingFor not found');
    return found;
  }

  async update(id: string, data: UpdateLookingForDto): Promise<LookingFor> {
    return this.prisma.lookingFor.update({ where: { id }, data });
  }

  async delete(id: string): Promise<LookingFor> {
    return this.prisma.lookingFor.delete({ where: { id } });
  }
}
