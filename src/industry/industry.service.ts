import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '../../generated/prisma';
import { ChannelListResponseDto } from './dto/channel-response.dto';
import { CreateIndustryDto } from './dto/create-industry.dto';
import {
  IndustryListResponseDto,
  IndustryResponseDto,
  IndustryWithRelationsResponseDto,
} from './dto/industry-response.dto';
import {
  SkillListResponseDto,
  SkillResponseDto,
} from './dto/skill-response.dto';
import { TagListResponseDto, TagResponseDto } from './dto/tag-response.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';
import { CreateProjectTagDto } from './dto/create-project-tag.dto';
import { UpdateProjectTagDto } from './dto/update-project-tag.dto';
import { FindProjectTagDto } from './dto/find-project-tag.dto';
import { ProjectTagResponseDto } from './dto/project-tag-response.dto';
import { CreateStandardsDto } from './dto/create-standards.dto';
import { UpdateStandardsDto } from './dto/update-standards.dto';
import { FindStandardsDto } from './dto/find-standards.dto';
import { StandardsResponseDto } from './dto/standards-response.dto';
import { CreateLookingForDto } from './dto/create-looking-for.dto';
import { UpdateLookingForDto } from './dto/update-looking-for.dto';
import { FindLookingForDto } from './dto/find-looking-for.dto';
import { LookingForResponseDto } from './dto/looking-for-response.dto';

@Injectable()
export class IndustryService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(): Promise<IndustryListResponseDto> {
    const industries = await this.prismaService.industry.findMany({
      select: {
        name: true,
        slug: true,
        color: true,
        description: true,
        image: true,
        id: true,
        createdAt: true,
        updatedAt: true,
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

    return {
      data: industries as IndustryWithRelationsResponseDto[],
      success: true,
      message: 'Industries retrieved successfully',
    };
  }

  async getSkills() {
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
  ): Promise<IndustryResponseDto> {
    // Check if industry with slug already exists
    const existingIndustry = await this.prismaService.industry.findUnique({
      where: { slug: createIndustryDto.slug },
    });

    if (existingIndustry) {
      throw new ConflictException(
        `Industry with slug ${createIndustryDto.slug} already exists`,
      );
    }

    const industry = await this.prismaService.industry.create({
      data: createIndustryDto,
    });

    return industry as IndustryResponseDto;
  }

  async findAllIndustries(params?: {
    skip?: number;
    take?: number;
  }): Promise<IndustryListResponseDto> {
    const { skip, take } = params || {};

    const industries = await this.prismaService.industry.findMany({
      skip,
      take,
      orderBy: { name: 'asc' },
    });

    return {
      data: industries as IndustryWithRelationsResponseDto[],
      success: true,
      message: 'Industries retrieved successfully',
    };
  }

  async findIndustryById(
    id: string,
  ): Promise<IndustryWithRelationsResponseDto> {
    const industry = await this.prismaService.industry.findUnique({
      where: { id },
      include: {
        Category: true,
        Channel: true,
        Source: true,
        Segment: true,
        Skill: true,
        Tag: true,
      },
    });

    if (!industry) {
      throw new NotFoundException(`Industry with ID ${id} not found`);
    }

    return industry as IndustryWithRelationsResponseDto;
  }

  async findIndustryBySlug(
    slug: string,
  ): Promise<IndustryWithRelationsResponseDto> {
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

    return industry as IndustryWithRelationsResponseDto;
  }

  async updateIndustry(id: string, updateIndustryDto: UpdateIndustryDto) {
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

  async deleteIndustry(id: string) {
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

  private async countIndustryRelations(slug: string) {
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
  }) {
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
  }): Promise<SkillListResponseDto> {
    const { skip, take, industrySlug } = params;

    const where: Prisma.SkillWhereInput = {};

    if (industrySlug) {
      where.industrySlug = industrySlug;
    }

    const skills = await this.prismaService.skill.findMany({
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
        id: true,
        createdAt: true,
        updatedAt: true,
        industrySlug: true,
        group: true,
      },
    });

    return {
      data: skills as SkillResponseDto[],
      success: true,
      message: 'Skills retrieved successfully',
    };
  }

  async findSkillBySlug(slug: string, industrySlug?: string) {
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
  ) {
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

  async deleteSkill(slug: string) {
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
  async createTag(data: { name: string; slug: string; industrySlug: string }) {
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
  }): Promise<TagListResponseDto> {
    const { skip, take, industrySlug } = params;

    const where: Prisma.TagWhereInput = {};

    if (industrySlug) {
      where.industrySlug = industrySlug;
    }

    const tags = await this.prismaService.tag.findMany({
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
        id: true,
        createdAt: true,
        updatedAt: true,
        industrySlug: true,
      },
    });

    return {
      data: tags as TagResponseDto[],
      success: true,
      message: 'Tags retrieved successfully',
    };
  }
  async findTagBySlug(slug: string, industrySlug?: string) {
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
  ) {
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
  async deleteTag(slug: string) {
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
  }) {
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
  }): Promise<ChannelListResponseDto> {
    const { skip, take, industrySlug } = params;

    const where: Prisma.ChannelWhereInput = {};

    if (industrySlug) {
      where.industrySlug = industrySlug;
    }

    const channels = await this.prismaService.channel.findMany({
      skip,
      take,
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        industrySlug: true,
        createdAt: true,
        updatedAt: true,
        industry: {
          select: {
            name: true,
            slug: true,
            color: true,
          },
        },
      },
    });

    return {
      data: channels,
      success: true,
      message: 'Channels retrieved successfully',
    };
  }
  async findChannelBySlug(slug: string, industrySlug?: string) {
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
  ) {
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
  async deleteChannel(slug: string) {
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

  // Category CRUD methods
  async createCategory(data: {
    name: string;
    slug: string;
    description?: string;
    image?: string;
    industrySlug: string;
  }) {
    // Check if industry exists
    const industry = await this.prismaService.industry.findUnique({
      where: { slug: data.industrySlug },
    });

    if (!industry) {
      throw new NotFoundException(
        `Industry with slug ${data.industrySlug} not found`,
      );
    }

    // Check if category with same slug already exists for this industry
    const existingCategory = await this.prismaService.category.findUnique({
      where: {
        slug_industrySlug: {
          slug: data.slug,
          industrySlug: data.industrySlug,
        },
      },
    });

    if (existingCategory) {
      throw new ConflictException(
        `Category with slug ${data.slug} already exists for industry ${data.industrySlug}`,
      );
    }

    return this.prismaService.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        image: data.image,
        industrySlug: data.industrySlug,
      },
    });
  }

  async findAllCategories(query: {
    industrySlug?: string;
    search?: string;
    skip?: number;
    take?: number;
  }) {
    const where: Prisma.CategoryWhereInput = {};

    if (query.industrySlug) {
      where.industrySlug = query.industrySlug;
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { slug: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prismaService.category.findMany({
        where,
        skip: query.skip,
        take: query.take,
        include: {
          industry: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      }),
      this.prismaService.category.count({ where }),
    ]);

    return { data, total };
  }

  async findCategoryBySlug(slug: string, industrySlug?: string) {
    const where: Prisma.CategoryWhereInput = { slug };

    if (industrySlug) {
      where.industrySlug = industrySlug;
    }

    const category = await this.prismaService.category.findFirst({
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

    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }

    return category;
  }

  async updateCategory(
    slug: string,
    data: {
      name?: string;
      newSlug?: string;
      description?: string;
      image?: string;
      industrySlug?: string;
    },
  ) {
    const category = await this.prismaService.category.findUnique({
      where: { slug },
    });

    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }

    // If updating industry, check if it exists
    if (data.industrySlug && data.industrySlug !== category.industrySlug) {
      const industry = await this.prismaService.industry.findUnique({
        where: { slug: data.industrySlug },
      });

      if (!industry) {
        throw new NotFoundException(
          `Industry with slug ${data.industrySlug} not found`,
        );
      }
    }

    return this.prismaService.category.update({
      where: { slug },
      data: {
        name: data.name,
        slug: data.newSlug || category.slug,
        description: data.description,
        image: data.image,
        industrySlug: data.industrySlug,
      },
    });
  }

  async deleteCategory(slug: string) {
    const category = await this.prismaService.category.findUnique({
      where: { slug },
    });

    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }

    return this.prismaService.category.delete({
      where: { slug },
    });
  }

  // Source CRUD methods
  async createSource(data: {
    name: string;
    slug: string;
    description?: string;
    image?: string;
    industrySlug: string;
  }) {
    // Check if industry exists
    const industry = await this.prismaService.industry.findUnique({
      where: { slug: data.industrySlug },
    });

    if (!industry) {
      throw new NotFoundException(
        `Industry with slug ${data.industrySlug} not found`,
      );
    }

    // Check if source with same slug already exists for this industry
    const existingSource = await this.prismaService.source.findUnique({
      where: {
        slug_industrySlug: {
          slug: data.slug,
          industrySlug: data.industrySlug,
        },
      },
    });

    if (existingSource) {
      throw new ConflictException(
        `Source with slug ${data.slug} already exists for industry ${data.industrySlug}`,
      );
    }

    return this.prismaService.source.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        image: data.image,
        industrySlug: data.industrySlug,
      },
    });
  }

  async findAllSources(query: {
    industrySlug?: string;
    search?: string;
    skip?: number;
    take?: number;
  }) {
    const where: Prisma.SourceWhereInput = {};

    if (query.industrySlug) {
      where.industrySlug = query.industrySlug;
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { slug: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prismaService.source.findMany({
        where,
        skip: query.skip,
        take: query.take,
        include: {
          industry: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      }),
      this.prismaService.source.count({ where }),
    ]);

    return { data, total };
  }

  async findSourceBySlug(slug: string, industrySlug?: string) {
    const where: Prisma.SourceWhereInput = { slug };

    if (industrySlug) {
      where.industrySlug = industrySlug;
    }

    const source = await this.prismaService.source.findFirst({
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

    if (!source) {
      throw new NotFoundException(`Source with slug ${slug} not found`);
    }

    return source;
  }

  async updateSource(
    slug: string,
    data: {
      name?: string;
      newSlug?: string;
      description?: string;
      image?: string;
      industrySlug?: string;
    },
  ) {
    const source = await this.prismaService.source.findUnique({
      where: { slug },
    });

    if (!source) {
      throw new NotFoundException(`Source with slug ${slug} not found`);
    }

    return this.prismaService.source.update({
      where: { slug },
      data: {
        name: data.name,
        slug: data.newSlug || source.slug,
        description: data.description,
        image: data.image,
        industrySlug: data.industrySlug,
      },
    });
  }

  async deleteSource(slug: string) {
    const source = await this.prismaService.source.findUnique({
      where: { slug },
    });

    if (!source) {
      throw new NotFoundException(`Source with slug ${slug} not found`);
    }

    return this.prismaService.source.delete({
      where: { slug },
    });
  }

  // Segment CRUD methods
  async createSegment(data: {
    name: string;
    slug: string;
    description?: string;
    image?: string;
    industrySlug: string;
  }) {
    // Check if industry exists
    const industry = await this.prismaService.industry.findUnique({
      where: { slug: data.industrySlug },
    });

    if (!industry) {
      throw new NotFoundException(
        `Industry with slug ${data.industrySlug} not found`,
      );
    }

    // Check if segment with same slug already exists for this industry
    const existingSegment = await this.prismaService.segment.findUnique({
      where: {
        slug_industrySlug: {
          slug: data.slug,
          industrySlug: data.industrySlug,
        },
      },
    });

    if (existingSegment) {
      throw new ConflictException(
        `Segment with slug ${data.slug} already exists for industry ${data.industrySlug}`,
      );
    }

    return this.prismaService.segment.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        image: data.image,
        industrySlug: data.industrySlug,
      },
    });
  }

  async findAllSegments(query: {
    industrySlug?: string;
    search?: string;
    skip?: number;
    take?: number;
  }) {
    const where: Prisma.SegmentWhereInput = {};

    if (query.industrySlug) {
      where.industrySlug = query.industrySlug;
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { slug: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prismaService.segment.findMany({
        where,
        skip: query.skip,
        take: query.take,
        include: {
          industry: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      }),
      this.prismaService.segment.count({ where }),
    ]);

    return { data, total };
  }

  async findSegmentBySlug(slug: string, industrySlug?: string) {
    const where: Prisma.SegmentWhereInput = { slug };

    if (industrySlug) {
      where.industrySlug = industrySlug;
    }

    const segment = await this.prismaService.segment.findFirst({
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

    if (!segment) {
      throw new NotFoundException(`Segment with slug ${slug} not found`);
    }

    return segment;
  }

  async updateSegment(
    slug: string,
    data: {
      name?: string;
      newSlug?: string;
      description?: string;
      image?: string;
      industrySlug?: string;
    },
  ) {
    const segment = await this.prismaService.segment.findUnique({
      where: { slug },
    });

    if (!segment) {
      throw new NotFoundException(`Segment with slug ${slug} not found`);
    }

    return this.prismaService.segment.update({
      where: { slug },
      data: {
        name: data.name,
        slug: data.newSlug || segment.slug,
        description: data.description,
        image: data.image,
        industrySlug: data.industrySlug,
      },
    });
  }

  async deleteSegment(slug: string) {
    const segment = await this.prismaService.segment.findUnique({
      where: { slug },
    });

    if (!segment) {
      throw new NotFoundException(`Segment with slug ${slug} not found`);
    }

    return this.prismaService.segment.delete({
      where: { slug },
    });
  }

  // Project Tag methods
  async createProjectTag(
    createProjectTagDto: CreateProjectTagDto,
  ): Promise<ProjectTagResponseDto> {
    const { name, slug, industrySlug } = createProjectTagDto;

    // Generate slug if not provided
    const projectTagSlug = slug || name.toLowerCase().replace(/\s+/g, '-');

    // Check if project tag with this slug already exists
    const existingProjectTag = await this.prismaService.projectTag.findUnique({
      where: { slug: projectTagSlug },
    });

    if (existingProjectTag) {
      throw new ConflictException(
        `Project tag with slug '${projectTagSlug}' already exists`,
      );
    }

    // Check if industry exists
    const industry = await this.prismaService.industry.findUnique({
      where: { slug: industrySlug },
    });

    if (!industry) {
      throw new NotFoundException(
        `Industry with slug '${industrySlug}' not found`,
      );
    }

    return this.prismaService.projectTag.create({
      data: {
        name,
        slug: projectTagSlug,
        industrySlug,
      },
    });
  }

  async findAllProjectTags(
    findProjectTagDto: FindProjectTagDto,
  ): Promise<ProjectTagResponseDto[]> {
    const { industrySlug, name } = findProjectTagDto;

    const where: Prisma.ProjectTagWhereInput = {};

    if (industrySlug) {
      where.industrySlug = industrySlug;
    }

    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    return this.prismaService.projectTag.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneProjectTag(slug: string): Promise<ProjectTagResponseDto> {
    const projectTag = await this.prismaService.projectTag.findUnique({
      where: { slug },
    });

    if (!projectTag) {
      throw new NotFoundException(`Project tag with slug '${slug}' not found`);
    }

    return projectTag;
  }

  async updateProjectTag(
    slug: string,
    updateProjectTagDto: UpdateProjectTagDto,
  ): Promise<ProjectTagResponseDto> {
    const projectTag = await this.prismaService.projectTag.findUnique({
      where: { slug },
    });

    if (!projectTag) {
      throw new NotFoundException(`Project tag with slug '${slug}' not found`);
    }

    const { name, slug: newSlug, industrySlug } = updateProjectTagDto;

    // If updating slug, check if new slug already exists
    if (newSlug && newSlug !== slug) {
      const existingProjectTag = await this.prismaService.projectTag.findUnique(
        {
          where: { slug: newSlug },
        },
      );

      if (existingProjectTag) {
        throw new ConflictException(
          `Project tag with slug '${newSlug}' already exists`,
        );
      }
    }

    // If updating industry, check if industry exists
    if (industrySlug && industrySlug !== projectTag.industrySlug) {
      const industry = await this.prismaService.industry.findUnique({
        where: { slug: industrySlug },
      });

      if (!industry) {
        throw new NotFoundException(
          `Industry with slug '${industrySlug}' not found`,
        );
      }
    }

    const updateData: Prisma.ProjectTagUpdateInput = {};

    if (name) updateData.name = name;
    if (newSlug) updateData.slug = newSlug;
    if (industrySlug) {
      updateData.industry = {
        connect: { slug: industrySlug },
      };
    }

    return this.prismaService.projectTag.update({
      where: { slug },
      data: updateData,
    });
  }

  async removeProjectTag(slug: string): Promise<ProjectTagResponseDto> {
    const projectTag = await this.prismaService.projectTag.findUnique({
      where: { slug },
    });

    if (!projectTag) {
      throw new NotFoundException(`Project tag with slug '${slug}' not found`);
    }

    return this.prismaService.projectTag.delete({
      where: { slug },
    });
  }

  // Standards methods
  async createStandards(
    createStandardsDto: CreateStandardsDto,
  ): Promise<StandardsResponseDto> {
    const { name, description, type, industrySlug, image } = createStandardsDto;

    // Check if industry exists
    const industry = await this.prismaService.industry.findUnique({
      where: { slug: industrySlug },
    });

    if (!industry) {
      throw new NotFoundException(
        `Industry with slug '${industrySlug}' not found`,
      );
    }

    return this.prismaService.standards.create({
      data: {
        name,
        description,
        type,
        industrySlug,
        image,
      },
    });
  }

  async findAllStandards(
    findStandardsDto: FindStandardsDto,
  ): Promise<StandardsResponseDto[]> {
    const { industrySlug, name, type } = findStandardsDto;

    const where: Prisma.StandardsWhereInput = {};

    if (industrySlug) {
      where.industrySlug = industrySlug;
    }

    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    if (type) {
      where.type = type;
    }

    return this.prismaService.standards.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneStandards(id: string): Promise<StandardsResponseDto> {
    const standards = await this.prismaService.standards.findUnique({
      where: { id },
    });

    if (!standards) {
      throw new NotFoundException(`Standards with ID '${id}' not found`);
    }

    return standards;
  }

  async updateStandards(
    id: string,
    updateStandardsDto: UpdateStandardsDto,
  ): Promise<StandardsResponseDto> {
    const standards = await this.prismaService.standards.findUnique({
      where: { id },
    });

    if (!standards) {
      throw new NotFoundException(`Standards with ID '${id}' not found`);
    }

    const { name, description, type, industrySlug, image } = updateStandardsDto;

    // If updating industry, check if industry exists
    if (industrySlug && industrySlug !== standards.industrySlug) {
      const industry = await this.prismaService.industry.findUnique({
        where: { slug: industrySlug },
      });

      if (!industry) {
        throw new NotFoundException(
          `Industry with slug '${industrySlug}' not found`,
        );
      }
    }

    const updateData: Prisma.StandardsUpdateInput = {};

    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (type) updateData.type = type;
    if (image !== undefined) updateData.image = image;
    if (industrySlug) {
      updateData.industry = {
        connect: { slug: industrySlug },
      };
    }

    return this.prismaService.standards.update({
      where: { id },
      data: updateData,
    });
  }

  async removeStandards(id: string): Promise<StandardsResponseDto> {
    const standards = await this.prismaService.standards.findUnique({
      where: { id },
    });

    if (!standards) {
      throw new NotFoundException(`Standards with ID '${id}' not found`);
    }

    return this.prismaService.standards.delete({
      where: { id },
    });
  }

  // LookingFor methods
  async createLookingFor(
    createLookingForDto: CreateLookingForDto,
  ): Promise<LookingForResponseDto> {
    const { name, slug, industrySlug } = createLookingForDto;

    // Generate slug if not provided
    const lookingForSlug = slug || name.toLowerCase().replace(/\s+/g, '-');

    // Check if looking for with this slug already exists
    const existingLookingFor = await this.prismaService.lookingFor.findUnique({
      where: { slug: lookingForSlug },
    });

    if (existingLookingFor) {
      throw new ConflictException(
        `Looking for with slug '${lookingForSlug}' already exists`,
      );
    }

    // Check if industry exists
    const industry = await this.prismaService.industry.findUnique({
      where: { slug: industrySlug },
    });

    if (!industry) {
      throw new NotFoundException(
        `Industry with slug '${industrySlug}' not found`,
      );
    }

    return this.prismaService.lookingFor.create({
      data: {
        name,
        slug: lookingForSlug,
        industrySlug,
      },
    });
  }

  async findAllLookingFor(
    findLookingForDto: FindLookingForDto,
  ): Promise<LookingForResponseDto[]> {
    const { industrySlug, name } = findLookingForDto;

    const where: Prisma.LookingForWhereInput = {};

    if (industrySlug) {
      where.industrySlug = industrySlug;
    }

    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    return this.prismaService.lookingFor.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneLookingFor(slug: string): Promise<LookingForResponseDto> {
    const lookingFor = await this.prismaService.lookingFor.findUnique({
      where: { slug },
    });

    if (!lookingFor) {
      throw new NotFoundException(`Looking for with slug '${slug}' not found`);
    }

    return lookingFor;
  }

  async updateLookingFor(
    slug: string,
    updateLookingForDto: UpdateLookingForDto,
  ): Promise<LookingForResponseDto> {
    const lookingFor = await this.prismaService.lookingFor.findUnique({
      where: { slug },
    });

    if (!lookingFor) {
      throw new NotFoundException(`Looking for with slug '${slug}' not found`);
    }

    const { name, slug: newSlug, industrySlug } = updateLookingForDto;

    // If updating slug, check if new slug already exists
    if (newSlug && newSlug !== slug) {
      const existingLookingFor = await this.prismaService.lookingFor.findUnique(
        {
          where: { slug: newSlug },
        },
      );

      if (existingLookingFor) {
        throw new ConflictException(
          `Looking for with slug '${newSlug}' already exists`,
        );
      }
    }

    // If updating industry, check if industry exists
    if (industrySlug && industrySlug !== lookingFor.industrySlug) {
      const industry = await this.prismaService.industry.findUnique({
        where: { slug: industrySlug },
      });

      if (!industry) {
        throw new NotFoundException(
          `Industry with slug '${industrySlug}' not found`,
        );
      }
    }

    const updateData: Prisma.LookingForUpdateInput = {};

    if (name) updateData.name = name;
    if (newSlug) updateData.slug = newSlug;
    if (industrySlug) {
      updateData.industry = {
        connect: { slug: industrySlug },
      };
    }

    return this.prismaService.lookingFor.update({
      where: { slug },
      data: updateData,
    });
  }

  async removeLookingFor(slug: string): Promise<LookingForResponseDto> {
    const lookingFor = await this.prismaService.lookingFor.findUnique({
      where: { slug },
    });

    if (!lookingFor) {
      throw new NotFoundException(`Looking for with slug '${slug}' not found`);
    }

    return this.prismaService.lookingFor.delete({
      where: { slug },
    });
  }
}
