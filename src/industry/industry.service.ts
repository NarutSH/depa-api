import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '../../generated/prisma';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';
import {
  IndustryBasicResponse,
  IndustryWithAllRelations,
  SkillWithIndustry,
  TagWithIndustry,
  ChannelWithIndustry,
  SkillResponse,
  TagResponse,
  ChannelResponse,
} from './dto/industry-response.dto';
import { Industry, Skill, Tag, Channel } from 'generated/prisma';

@Injectable()
export class IndustryService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(): Promise<IndustryBasicResponse[]> {
    return this.prismaService.industry.findMany({
      select: {
        name: true,
        slug: true,
        color: true,
        description: true,
        image: true,
        // Category: {
        //   select: {
        //     slug: true,
        //     name: true,
        //   },
        // },
        // Source: {
        //   select: {
        //     slug: true,
        //     name: true,
        //   },
        // },
        // Channel: {
        //   select: {
        //     slug: true,
        //     name: true,
        //   },
        // },
      },
    });
  }

  async getSkills(): Promise<any[]> {
    return this.prismaService.industry.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        color: true,
        createdAt: true,
        updatedAt: true,
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

  // Industry CRUD operations
  async createIndustry(
    createIndustryDto: CreateIndustryDto,
  ): Promise<Industry> {
    // Check if industry with slug already exists
    const existingIndustry = await this.prismaService.industry.findUnique({
      where: { slug: createIndustryDto.slug },
    });

    if (existingIndustry) {
      throw new ConflictException(
        `Industry with slug ${createIndustryDto.slug} already exists`,
      );
    }

    return this.prismaService.industry.create({
      data: createIndustryDto,
    });
  }

  async findAllIndustries(params?: {
    skip?: number;
    take?: number;
  }): Promise<Industry[]> {
    const { skip, take } = params || {};

    return this.prismaService.industry.findMany({
      skip,
      take,
      orderBy: { name: 'asc' },
    });
  }

  async findIndustryById(id: string): Promise<IndustryWithAllRelations> {
    const industry = await this.prismaService.industry.findUnique({
      where: { id },
      include: {
        Category: true,
        Channel: true,
        Source: true,
        Segment: true,
        Skill: true,
        Tag: true,
        LookingFor: true,
      },
    });

    if (!industry) {
      throw new NotFoundException(`Industry with ID ${id} not found`);
    }

    return industry;
  }

  async findIndustryBySlug(slug: string): Promise<IndustryWithAllRelations> {
    const industry = await this.prismaService.industry.findUnique({
      where: { slug },
      include: {
        Category: true,
        Channel: true,
        Source: true,
        Segment: true,
        Skill: true,
        Tag: true,
        LookingFor: true,
      },
    });

    if (!industry) {
      throw new NotFoundException(`Industry with slug ${slug} not found`);
    }

    return industry;
  }

  async updateIndustry(
    id: string,
    updateIndustryDto: UpdateIndustryDto,
  ): Promise<Industry> {
    // Check if industry exists
    const existingIndustry = await this.prismaService.industry.findUnique({
      where: { id },
    });

    if (!existingIndustry) {
      throw new NotFoundException(`Industry with ID ${id} not found`);
    }

    // If slug is being updated, check if the new slug is already taken
    if (
      updateIndustryDto.slug &&
      updateIndustryDto.slug !== existingIndustry.slug
    ) {
      const slugExists = await this.prismaService.industry.findUnique({
        where: { slug: updateIndustryDto.slug },
      });

      if (slugExists) {
        throw new ConflictException(
          `Industry with slug ${updateIndustryDto.slug} already exists`,
        );
      }
    }

    return this.prismaService.industry.update({
      where: { id },
      data: updateIndustryDto,
    });
  }

  async deleteIndustry(id: string): Promise<Industry> {
    // Check if industry exists
    const existingIndustry = await this.prismaService.industry.findUnique({
      where: { id },
    });

    if (!existingIndustry) {
      throw new NotFoundException(`Industry with ID ${id} not found`);
    }

    // Check if industry has related records that would prevent deletion
    const relatedRecordsCount = await this.countIndustryRelations(
      existingIndustry.slug,
    );

    if (relatedRecordsCount > 0) {
      throw new ConflictException(
        `Cannot delete industry because it has ${relatedRecordsCount} related records. Remove related records first.`,
      );
    }

    return this.prismaService.industry.delete({
      where: { id },
    });
  }

  private async countIndustryRelations(slug: string): Promise<number> {
    const [
      categoryCount,
      channelCount,
      sourceCount,
      segmentCount,
      skillCount,
      tagCount,
      lookingForCount,
      companyCount,
      freelanceCount,
      userCount,
      standardsCount,
      revenueStreamCount,
    ] = await Promise.all([
      this.prismaService.category.count({ where: { industrySlug: slug } }),
      this.prismaService.channel.count({ where: { industrySlug: slug } }),
      this.prismaService.source.count({ where: { industrySlug: slug } }),
      this.prismaService.segment.count({ where: { industrySlug: slug } }),
      this.prismaService.skill.count({ where: { industrySlug: slug } }),
      this.prismaService.tag.count({ where: { industrySlug: slug } }),
      this.prismaService.lookingFor.count({ where: { industrySlug: slug } }),
      this.prismaService.companyIndustry.count({
        where: { industrySlug: slug },
      }),
      this.prismaService.freelanceIndustry.count({
        where: { industrySlug: slug },
      }),
      this.prismaService.userIndustry.count({ where: { industry: { slug } } }),
      this.prismaService.standards.count({ where: { industrySlug: slug } }),
      this.prismaService.revenueStream.count({
        where: { industryTypeSlug: slug },
      }),
    ]);

    return (
      categoryCount +
      channelCount +
      sourceCount +
      segmentCount +
      skillCount +
      tagCount +
      lookingForCount +
      companyCount +
      freelanceCount +
      userCount +
      standardsCount +
      revenueStreamCount
    );
  }

  // CRUD operations for Skill model

  async createSkill(data: {
    title: string;
    slug: string;
    group?: string;
    industrySlug: string;
  }): Promise<Skill> {
    // First check if industry exists
    const industry = await this.prismaService.industry.findUnique({
      where: { slug: data.industrySlug },
    });

    if (!industry) {
      throw new NotFoundException(
        `Industry with slug ${data.industrySlug} not found`,
      );
    }

    // Check if skill with same slug already exists
    const existingSkill = await this.prismaService.skill.findFirst({
      where: {
        slug: data.slug,
        industrySlug: data.industrySlug,
      },
    });

    if (existingSkill) {
      throw new Error(
        `Skill with slug ${data.slug} already exists for industry ${data.industrySlug}`,
      );
    }

    return this.prismaService.skill.create({
      data,
    });
  }

  async findAllSkills(params: {
    skip?: number;
    take?: number;
    industrySlug?: string;
  }): Promise<SkillResponse[]> {
    const { skip, take, industrySlug } = params;

    const where: Prisma.SkillWhereInput = {};

    if (industrySlug) {
      where.industrySlug = industrySlug;
    }

    return this.prismaService.skill.findMany({
      skip,
      take,
      where,
      select: {
        title: true,
        slug: true,
        industry: {
          select: {
            name: true,
            slug: true,
            color: true,
          },
        },
      },
    });
  }

  async findSkillBySlug(
    slug: string,
    industrySlug?: string,
  ): Promise<SkillWithIndustry> {
    const where: Prisma.SkillWhereInput = { slug };

    if (industrySlug) {
      where.industrySlug = industrySlug;
    }

    const skill = await this.prismaService.skill.findFirst({
      where,
      include: {
        industry: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!skill) {
      throw new NotFoundException(`Skill with slug ${slug} not found`);
    }

    return skill;
  }

  async updateSkill(
    slug: string,
    data: {
      title?: string;
      group?: string;
      newSlug?: string;
    },
  ): Promise<Skill> {
    const skill = await this.prismaService.skill.findUnique({
      where: { slug },
    });

    if (!skill) {
      throw new NotFoundException(`Skill with slug ${slug} not found`);
    }

    return this.prismaService.skill.update({
      where: { slug },
      data: {
        title: data.title,
        group: data.group,
        slug: data.newSlug || skill.slug,
      },
    });
  }

  async deleteSkill(slug: string): Promise<Skill> {
    const skill = await this.prismaService.skill.findUnique({
      where: { slug },
    });

    if (!skill) {
      throw new NotFoundException(`Skill with slug ${slug} not found`);
    }

    return this.prismaService.skill.delete({
      where: { slug },
    });
  }

  // CRUD operations for Tags model
  async createTag(data: {
    name: string;
    slug: string;
    industrySlug: string;
  }): Promise<Tag> {
    // First check if industry exists
    const industry = await this.prismaService.industry.findUnique({
      where: { slug: data.industrySlug },
    });

    if (!industry) {
      throw new NotFoundException(
        `Industry with slug ${data.industrySlug} not found`,
      );
    }

    // Check if tag with same slug already exists
    const existingTag = await this.prismaService.tag.findFirst({
      where: {
        slug: data.slug,
        industrySlug: data.industrySlug,
      },
    });

    if (existingTag) {
      throw new Error(
        `Tag with slug ${data.slug} already exists for industry ${data.industrySlug}`,
      );
    }

    return this.prismaService.tag.create({
      data,
    });
  }
  async findAllTags(params: {
    skip?: number;
    take?: number;
    industrySlug?: string;
  }): Promise<TagResponse[]> {
    const { skip, take, industrySlug } = params;

    const where: Prisma.TagWhereInput = {};

    if (industrySlug) {
      where.industrySlug = industrySlug;
    }

    return this.prismaService.tag.findMany({
      skip,
      take,
      where,
      select: {
        name: true,
        slug: true,
        industry: {
          select: {
            name: true,
            slug: true,
            color: true,
          },
        },
      },
    });
  }
  async findTagBySlug(
    slug: string,
    industrySlug?: string,
  ): Promise<TagWithIndustry> {
    const where: Prisma.TagWhereInput = { slug };

    if (industrySlug) {
      where.industrySlug = industrySlug;
    }

    const tag = await this.prismaService.tag.findFirst({
      where,
      include: {
        industry: {
          select: {
            name: true,
            slug: true,
            color: true,
          },
        },
      },
    });

    if (!tag) {
      throw new NotFoundException(`Tag with slug ${slug} not found`);
    }

    return tag;
  }
  async updateTag(
    slug: string,
    data: {
      title?: string;
      newSlug?: string;
    },
  ): Promise<Tag> {
    const tag = await this.prismaService.tag.findUnique({
      where: { slug },
    });

    if (!tag) {
      throw new NotFoundException(`Tag with slug ${slug} not found`);
    }

    return this.prismaService.tag.update({
      where: { slug },
      data: {
        name: data.title,
        slug: data.newSlug || tag.slug,
      },
    });
  }
  async deleteTag(slug: string): Promise<Tag> {
    const tag = await this.prismaService.tag.findUnique({
      where: { slug },
    });

    if (!tag) {
      throw new NotFoundException(`Tag with slug ${slug} not found`);
    }

    return this.prismaService.tag.delete({
      where: { slug },
    });
  }

  // CRUD operations for Channels model
  async createChannel(data: {
    name: string;
    slug: string;
    industrySlug: string;
  }): Promise<Channel> {
    // First check if industry exists
    const industry = await this.prismaService.industry.findUnique({
      where: { slug: data.industrySlug },
    });

    if (!industry) {
      throw new NotFoundException(
        `Industry with slug ${data.industrySlug} not found`,
      );
    }

    // Check if channel with same slug already exists
    const existingChannel = await this.prismaService.channel.findFirst({
      where: {
        slug: data.slug,
        industrySlug: data.industrySlug,
      },
    });

    if (existingChannel) {
      throw new Error(
        `Channel with slug ${data.slug} already exists for industry ${data.industrySlug}`,
      );
    }

    return this.prismaService.channel.create({
      data,
    });
  }
  async findAllChannels(params: {
    skip?: number;
    take?: number;
    industrySlug?: string;
  }): Promise<ChannelResponse[]> {
    const { skip, take, industrySlug } = params;

    const where: Prisma.ChannelWhereInput = {};

    if (industrySlug) {
      where.industrySlug = industrySlug;
    }

    return this.prismaService.channel.findMany({
      skip,
      take,
      where,
      select: {
        name: true,
        slug: true,
        industry: {
          select: {
            name: true,
            slug: true,
            color: true,
          },
        },
      },
    });
  }
  async findChannelBySlug(
    slug: string,
    industrySlug?: string,
  ): Promise<ChannelWithIndustry> {
    const where: Prisma.ChannelWhereInput = { slug };

    if (industrySlug) {
      where.industrySlug = industrySlug;
    }

    const channel = await this.prismaService.channel.findFirst({
      where,
      include: {
        industry: {
          select: {
            name: true,
            slug: true,
            color: true,
          },
        },
      },
    });

    if (!channel) {
      throw new NotFoundException(`Channel with slug ${slug} not found`);
    }

    return channel;
  }
  async updateChannel(
    slug: string,
    data: {
      title?: string;
      newSlug?: string;
    },
  ): Promise<Channel> {
    const channel = await this.prismaService.channel.findUnique({
      where: { slug },
    });

    if (!channel) {
      throw new NotFoundException(`Channel with slug ${slug} not found`);
    }

    return this.prismaService.channel.update({
      where: { slug },
      data: {
        name: data.title,
        slug: data.newSlug || channel.slug,
      },
    });
  }
  async deleteChannel(slug: string): Promise<Channel> {
    const channel = await this.prismaService.channel.findUnique({
      where: { slug },
    });

    if (!channel) {
      throw new NotFoundException(`Channel with slug ${slug} not found`);
    }

    return this.prismaService.channel.delete({
      where: { slug },
    });
  }
}
