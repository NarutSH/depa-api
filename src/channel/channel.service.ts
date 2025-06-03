import { PrismaService } from '../prisma/prisma.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChannelService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateChannelDto) {
    return this.prisma.channel.create({ data });
  }

  async findAll(query: any = {}) {
    const where: any = {};
    if (query.industry) {
      where.industrySlug = query.industry;
    }
    // Pagination and sorting from QueryMetadataDto
    const skip =
      query.page && query.limit
        ? (Number(query.page) - 1) * Number(query.limit)
        : undefined;
    const take = query.limit ? Number(query.limit) : undefined;
    let orderBy: any = { createdAt: 'desc' };
    if (query.sort) {
      const [field, direction] = query.sort.split(':');
      orderBy = { [field]: direction === 'desc' ? 'desc' : 'asc' };
    }
    const [data, total] = await Promise.all([
      this.prisma.channel.findMany({ where, orderBy, skip, take }),
      this.prisma.channel.count({ where }),
    ]);
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : take || 10;
    const totalPages = limit > 0 ? Math.ceil(total / limit) : 1;
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async findOne(id: string) {
    return this.prisma.channel.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateChannelDto) {
    return this.prisma.channel.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.channel.delete({ where: { id } });
  }
}
