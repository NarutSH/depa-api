import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import CreateUserDto from './dtos/create-user.dto';
import UpdateUserDto from './dtos/update-user.dto';
import { UsersService } from './users.service';
// Removed imports to deleted files
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Role } from '../auth/roles.enum';
import QueryMetadataDto from './dtos/query-metadata.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Only admin can list all users
  @Get()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieves all users. Admin only.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all users retrieved successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - requires admin role' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (1-based)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term for email, fullnameTh, fullnameEn',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Sort field and direction (e.g., email:asc, createdAt:desc)',
  })
  async getAllUsers(@Query() query: QueryMetadataDto) {
    return this.usersService.getAllUsers(query);
  }

  // Get current user profile
  @Get('me')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Retrieves the profile of the currently authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Current user profile retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - requires authentication',
  })
  async getMe(@Req() req: Request) {
    console.log('req==>', req);
    const user = req.user as any;

    if (!user?.id) {
      throw new ForbiddenException('User ID not found in request');
    }

    return this.usersService.getMe(user.id);
  }

  // User profile access - restricted by role
  @Get(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Get user by ID',
    description:
      'Retrieves user by ID. Users can only access their own profile.',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({
    status: 403,
    description: "Forbidden - cannot access other users' profiles",
  })
  @ApiResponse({ status: 404, description: 'User not found' })
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

  // Allow email lookup for all authenticated users
  @Get('email/:email')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get user by email',
    description: 'Retrieves user by email for any authenticated user.',
  })
  @ApiParam({ name: 'email', description: 'User email address' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - requires authentication',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserByEmail(@Param('email') email: string) {
    return this.usersService.getUserByEmail(email);
  }

  // Allow users to create their own profile
  @Post()
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Create user profile',
    description: 'Creates a new user profile for authenticated users.',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User profile created successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - requires authentication',
  })
  @ApiResponse({ status: 400, description: 'Bad request - invalid input' })
  async createUser(@Body() body: CreateUserDto, @Req() req: Request) {
    const user = req.user as any;

    // Ensure the email in the profile matches the authenticated user
    if (user.email !== body.email) {
      throw new ForbiddenException(
        'You can only create a profile with your own email',
      );
    }

    return this.usersService.createUser(body);
  }

  // Update user profile - restricted by role
  @Patch(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Update user',
    description:
      'Updates a user by ID. Users can only update their own profile.',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({
    status: 403,
    description: "Forbidden - cannot update other users's profiles",
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
    // @Req() req: Request,
  ) {
    try {
      return this.usersService.updateUser(id, body);
    } catch (error) {
      console.error('Error updating user:', error);
      throw new ForbiddenException('Failed to update user');
    }
  }

  // Update by email - admin only
  @Patch('email/:email')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Update user by email',
    description: 'Updates a user by email. Admin only.',
  })
  @ApiParam({ name: 'email', description: 'User email address' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires admin role' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUserByEmail(
    @Param('email') email: string,
    @Body() body: UpdateUserDto,
  ) {
    return this.usersService.updateUserByEmail(email, body);
  }
}
