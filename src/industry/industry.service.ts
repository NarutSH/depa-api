import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class IndustryService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    return this.prismaService.industry.findMany({
      select: {
        name: true,
        slug: true,
        Category: {
          select: {
            slug: true,
            name: true,
          },
        },
        Source: {
          select: {
            slug: true,
            name: true,
          },
        },
        Channel: {
          select: {
            slug: true,
            name: true,
          },
        },
      },
    });
  }

  async getSkills() {
    return this.prismaService.industry.findMany({
      select: {
        name: true,
        slug: true,
        Skill: {
          select: {
            title: true,
            slug: true,
            industrySlug: true,
          },
        },
      },
    });
  }
}
