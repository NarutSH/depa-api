import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import CreateUserDto from './dtos/create-user.dto';
import UpdateUserDto from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllUsers() {
    return this.prismaService.user.findMany();
  }

  async createUser(data: CreateUserDto) {
    return this.prismaService.user.create({ data });
  }

  async updateUser(id: string, data: UpdateUserDto) {
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
