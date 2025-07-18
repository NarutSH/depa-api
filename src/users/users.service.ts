import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import CreateUserDto from './dtos/create-user.dto';
import UpdateUserDto from './dtos/update-user.dto';
import { QueryMetadataDto, ResponseMetadata } from 'src/utils';
import { QueryUtilsService } from 'src/utils/services/query-utils.service';
import {
  GetAllUsersResponse,
  UserWithDetailedRelations,
  UserWithRevenueRelations,
  TransformedUserResponse,
} from './dtos/user-response.dto';
import { User } from 'generated/prisma';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly queryUtils: QueryUtilsService,
  ) {}

  async getAllUsers(queryDto: QueryMetadataDto): Promise<GetAllUsersResponse> {
    // Ensure we have valid pagination values
    const page = Number(queryDto.page) || 1;
    const limit = Number(queryDto.limit) || 10;
    const skip = (page - 1) * limit;

    // Define searchable fields for users
    const searchableFields = ['email', 'fullnameTh', 'fullnameEn', 'about'];

    // Build where clause for filtering and searching
    const where = this.queryUtils.buildWhereClause(queryDto, searchableFields);

    // Build orderBy clause for sorting
    const orderBy = this.queryUtils.buildOrderByClause(queryDto, {
      createdAt: 'desc',
    });

    // Execute the query with pagination
    const [users, total] = await Promise.all([
      this.prismaService.user.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          company: {
            select: {
              id: true,
              nameTh: true,
              nameEn: true,
              juristicId: true,
            },
          },
          freelance: {
            select: {
              id: true,
              firstNameTh: true,
              lastNameTh: true,
              firstNameEn: true,
              lastNameEn: true,
              juristicId: true,
            },
          },
          industryTags: {
            select: {
              tag: {
                select: {
                  name: true,
                  slug: true,
                  industry: {
                    select: {
                      name: true,
                      slug: true,
                    },
                  },
                },
              },
            },
          },
          industryChannels: {
            select: {
              channel: {
                select: {
                  name: true,
                  slug: true,
                  industry: {
                    select: {
                      name: true,
                      slug: true,
                    },
                  },
                },
              },
            },
          },
          industrySkills: {
            select: {
              skill: {
                select: {
                  title: true,
                  slug: true,
                  industry: {
                    select: {
                      name: true,
                      slug: true,
                    },
                  },
                },
              },
            },
          },
          industriesRelated: {
            select: {
              industry: true,
            },
          },
        },
      }),
      this.prismaService.user.count({ where }),
    ]);

    // Return paginated response with metadata
    return ResponseMetadata.paginated(
      users,
      total,
      page,
      limit,
      'Users retrieved successfully',
    );
  }

  async createUser(data: CreateUserDto): Promise<User> {
    return this.prismaService.user.create({ data });
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    // Extract relationship arrays from DTO
    const {
      tags_array,
      channels_array,
      specialists_array,
      industries,
      ...userData
    } = data;

    // Update user base data
    const updatedUser = await this.prismaService.user.update({
      where: { id: id },
      data: userData,
    });

    console.log('industries===>', industries);

    // Update user industries
    await this.prismaService.userIndustry.deleteMany({
      where: { userId: id },
    });
    if (industries) {
      await this.prismaService.userIndustry.createMany({
        data: industries.map((industry) => ({
          userId: id,
          industrySlug: industry,
        })),
      });
    }

    // Update user tags
    await this.prismaService.userTags.deleteMany({
      where: { userId: id },
    });

    if (tags_array) {
      await this.prismaService.userTags.createMany({
        data: tags_array.map((tag) => ({
          userId: id,
          tagSlug: tag,
        })),
      });
    }

    // Update user channels
    await this.prismaService.userChannels.deleteMany({
      where: { userId: id },
    });
    if (channels_array) {
      await this.prismaService.userChannels.createMany({
        data: channels_array.map((channel) => ({
          userId: id,
          channelSlug: channel,
        })),
      });
    }

    // Update user specialists
    await this.prismaService.userSkills.deleteMany({
      where: { userId: id },
    });
    if (specialists_array) {
      await this.prismaService.userSkills.createMany({
        data: specialists_array.map((specialist) => ({
          userId: id,
          skillSlug: specialist,
        })),
      });
    }

    return updatedUser;
  }

  async updateUserByEmail(email: string, data: UpdateUserDto): Promise<User> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { tags_array, channels_array, specialists_array, ...userData } = data;
    return this.prismaService.user.update({ where: { email }, data: userData });
  }

  async getUserById(id: string): Promise<UserWithDetailedRelations> {
    const user = await this.prismaService.user.findUnique({
      where: { id: id },
      include: {
        company: true,
        freelance: true,
        industryTags: {
          include: {
            tag: true,
          },
        },
        industryChannels: {
          include: {
            channel: true,
          },
        },
        industrySkills: {
          include: {
            skill: true,
          },
        },
        industriesRelated: {
          include: {
            industry: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async getMe(userId: string): Promise<TransformedUserResponse> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: {
        company: {
          include: {
            companyRevenue: true,
          },
        },
        freelance: {
          include: {
            freelanceRevenue: true,
          },
        },
        industryTags: {
          select: {
            tag: {
              select: {
                name: true,
                slug: true,
                industry: {
                  select: {
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
        industryChannels: {
          select: {
            channel: {
              select: {
                name: true,
                slug: true,
                industry: {
                  select: {
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
        industrySkills: {
          select: {
            skill: {
              select: {
                title: true,
                slug: true,
                industry: {
                  select: {
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
        industriesRelated: {
          select: {
            industry: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const transformedUser = {
      ...user,
      industryTags: user.industryTags.map((item) => ({
        name: item.tag.name,
        slug: item.tag.slug,
        industry: item.tag.industry,
      })),
      industryChannels: user.industryChannels.map((item) => ({
        name: item.channel.name,
        slug: item.channel.slug,
        industry: item.channel.industry,
      })),
      industrySkills: user.industrySkills.map((item) => ({
        title: item.skill.title,
        slug: item.skill.slug,
        industry: item.skill.industry,
      })),
    };

    return transformedUser;
  }

  async getUserByEmail(email: string): Promise<UserWithRevenueRelations> {
    const user = await this.prismaService.user.findUnique({
      where: { email: email },
      include: {
        company: {
          include: {
            companyRevenue: true,
          },
        },
        freelance: {
          include: {
            freelanceRevenue: true,
          },
        },
        industryTags: {
          select: {
            tag: {
              select: {
                name: true,
                slug: true,
                industry: {
                  select: {
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
        industryChannels: {
          select: {
            channel: {
              select: {
                name: true,
                slug: true,
                industry: {
                  select: {
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
        industrySkills: {
          select: {
            skill: {
              select: {
                title: true,
                slug: true,
                industry: {
                  select: {
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
        industriesRelated: {
          select: {
            industry: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }
}
