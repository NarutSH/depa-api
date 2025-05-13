import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import CreateUserDto from './dtos/create-user.dto';
import UpdateUserDto from './dtos/update-user.dto';
import { QueryMetadataDto, ResponseMetadata } from 'src/utils';
import { QueryUtilsService } from 'src/utils/services/query-utils.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly queryUtils: QueryUtilsService,
  ) {}

  async getAllUsers(queryDto: QueryMetadataDto) {
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

  async createUser(data: CreateUserDto) {
    return this.prismaService.user.create({ data });
  }

  async updateUser(id: string, data: UpdateUserDto) {
    console.log('updateUser==>', id, data);
    return this.prismaService.user.update({ where: { id: id }, data });
  }
  async updateUserByEmail(email: string, data: UpdateUserDto) {
    return this.prismaService.user.update({ where: { email }, data });
  }

  async getUserById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: id },
      include: {
        company: true,
        freelance: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async getMe(userId: string) {
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
      },
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  async findOne(id: string) {
    try {
      // Uses the existing getUserById but handles the NotFoundException gracefully
      // This is what the JWT strategy expects
      return await this.getUserById(id);
    } catch (error) {
      // Return null instead of throwing an exception for the JWT strategy
      if (error instanceof NotFoundException) {
        return null;
      }
      throw error;
    }
  }

  async getUserByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email: email },
      include: {
        company: {
          include: {
            companyRevenue: true,
          },
        },
        freelance: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }
}
