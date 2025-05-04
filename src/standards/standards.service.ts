import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StandardsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getStandards() {
    return this.prismaService.standards.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        image: true,
        industrySlug: true,
      },
    });
  }
}
