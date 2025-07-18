import { PrismaService } from '../prisma/prisma.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { GetAllChannelsResponse } from './dto/channel-response.dto';
import { ChannelQueryParams } from './dto/channel-query.dto';
import { Injectable } from '@nestjs/common';
import { Channel, Prisma } from 'generated/prisma';

@Injectable()
export class ChannelService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateChannelDto): Promise<Channel> {
    return this.prisma.channel.create({ data });
  }

  async findAll(
    query: Partial<ChannelQueryParams> = {},
  ): Promise<GetAllChannelsResponse> {
    const where: Prisma.ChannelWhereInput = {};
    if (query.industry) {
      where.industrySlug = query.industry;
    }
    // Pagination and sorting from QueryMetadataDto
    const skip =
      query.page && query.limit
        ? (Number(query.page) - 1) * Number(query.limit)
        : undefined;
    const take = query.limit ? Number(query.limit) : undefined;
    let orderBy: Prisma.ChannelOrderByWithRelationInput = { createdAt: 'desc' };
    if (query.sort) {
      const [field, direction] = query.sort.split(':');
      orderBy = {
        [field]: direction === 'desc' ? 'desc' : 'asc',
      } as Prisma.ChannelOrderByWithRelationInput;
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

  async findOne(id: string): Promise<Channel | null> {
    return this.prisma.channel.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateChannelDto): Promise<Channel> {
    return this.prisma.channel.update({ where: { id }, data });
  }

  async remove(id: string): Promise<Channel> {
    return this.prisma.channel.delete({ where: { id } });
  }
}
