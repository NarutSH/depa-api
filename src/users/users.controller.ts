import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import CreateUserDto from './dtos/create-user.dto';
import UpdateUserDto from './dtos/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/roles.enum';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Only admin can list all users
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  // User profile access - restricted by role
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getUserById(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as any;

    // Admin can access any profile
    if (user.userType === Role.ADMIN) {
      return this.usersService.getUserById(id);
    }

    // Users can only access their own profile
    if (user.id === id) {
      return this.usersService.getUserById(id);
    }

    throw new ForbiddenException('You can only access your own profile');
  }

  // Allow email lookup by admin only
  @Get('email/:email')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getUserByEmail(@Param('email') email: string) {
    return this.usersService.getUserByEmail(email);
  }

  // Creating users is only allowed by admin
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async createUser(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body);
  }

  // Update user profile - restricted by role
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
    @Req() req: Request,
  ) {
    const user = req.user as any;

    // Admin can update any profile
    if (user.userType === Role.ADMIN) {
      return this.usersService.updateUser(id, body);
    }

    // Users can only update their own profile
    if (user.id === id) {
      return this.usersService.updateUser(id, body);
    }

    throw new ForbiddenException('You can only update your own profile');
  }

  // Update by email - admin only
  @Patch('email/:email')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateUserByEmail(
    @Param('email') email: string,
    @Body() body: UpdateUserDto,
  ) {
    return this.usersService.updateUserByEmail(email, body);
  }
}
