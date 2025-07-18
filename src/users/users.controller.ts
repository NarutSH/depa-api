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
import { QueryMetadataDto } from 'src/utils';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description:
      'Retrieves a paginated list of all users with industry relations and filtering support. Admin only.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all users retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              email: { type: 'string' },
              fullnameTh: { type: 'string' },
              fullnameEn: { type: 'string' },
              about: { type: 'string' },
              phoneNumber: { type: 'string' },
              website: { type: 'string' },
              location: { type: 'string' },
              image: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        totalPages: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - requires admin role',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid query parameters',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page (default: 10, max: 100)',
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term for user name, email, or about fields',
    example: 'software developer',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description:
      'Sort field (createdAt, updatedAt, fullnameTh, fullnameEn, email)',
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    type: String,
    description: 'Sort order (asc/desc)',
    example: 'desc',
  })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              email: { type: 'string' },
              fullnameTh: { type: 'string' },
              fullnameEn: { type: 'string' },
              about: { type: 'string' },
              phoneNumber: { type: 'string' },
              website: { type: 'string' },
              location: { type: 'string' },
              image: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        totalPages: { type: 'number' },
      },
    },
  })
  async getAllUsers(@Query() query: QueryMetadataDto) {
    return this.usersService.getAllUsers(query);
  }

  @Get('me')
  @ApiOperation({
    summary: 'Get current user profile',
    description:
      'Retrieves the profile of the currently authenticated user with transformed data structure.',
  })
  @ApiResponse({
    status: 200,
    description: 'Current user profile retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        fullnameTh: { type: 'string' },
        fullnameEn: { type: 'string' },
        about: { type: 'string' },
        phoneNumber: { type: 'string' },
        website: { type: 'string' },
        location: { type: 'string' },
        image: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - requires authentication',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User ID not found in request',
  })
  async getMe(@Req() req: Request) {
    console.log('req==>', req);
    const user = req.user as any;

    if (!user?.id) {
      throw new ForbiddenException('User ID not found in request');
    }

    return this.usersService.getMe(user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description:
      'Retrieves user by ID with detailed relations. Users can only access their own profile unless they are admin.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User unique identifier',
    example: 'clxyz123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        fullnameTh: { type: 'string' },
        fullnameEn: { type: 'string' },
        about: { type: 'string' },
        phoneNumber: { type: 'string' },
        website: { type: 'string' },
        location: { type: 'string' },
        image: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - requires authentication',
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - cannot access other users' profiles",
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
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

  @Get('email/:email')
  @ApiOperation({
    summary: 'Get user by email',
    description:
      'Retrieves a user by their email address with revenue stream relations',
  })
  @ApiParam({
    name: 'email',
    type: String,
    description: 'User email address',
    example: 'john.smith@example.com',
  })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        fullnameTh: { type: 'string' },
        fullnameEn: { type: 'string' },
        about: { type: 'string' },
        phoneNumber: { type: 'string' },
        website: { type: 'string' },
        location: { type: 'string' },
        image: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getUserByEmail(@Param('email') email: string) {
    return this.usersService.getUserByEmail(email);
  }

  @Post()
  @ApiOperation({
    summary: 'Create user profile',
    description:
      'Creates a new user profile for authenticated users with industry associations.',
  })
  @ApiBody({
    type: CreateUserDto,
    description:
      'User creation data with profile information and industry associations',
  })
  @ApiResponse({
    status: 201,
    description: 'User profile created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        fullnameTh: { type: 'string' },
        fullnameEn: { type: 'string' },
        about: { type: 'string' },
        phoneNumber: { type: 'string' },
        website: { type: 'string' },
        location: { type: 'string' },
        image: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid input data or validation errors',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - requires authentication',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - can only create profile with own email',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - user profile already exists',
  })
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

  @Patch(':id')
  @ApiOperation({
    summary: 'Update user profile',
    description:
      'Updates a user profile by ID. Users can only update their own profile unless they are admin.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User unique identifier',
    example: 'clxyz123456789',
  })
  @ApiBody({
    type: UpdateUserDto,
    description:
      'User update data with optional profile fields and industry associations',
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        fullnameTh: { type: 'string' },
        fullnameEn: { type: 'string' },
        about: { type: 'string' },
        phoneNumber: { type: 'string' },
        website: { type: 'string' },
        location: { type: 'string' },
        image: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid input data or validation errors',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - requires authentication',
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - cannot update other users' profiles",
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
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

  @Patch('email/:email')
  @ApiOperation({
    summary: 'Update user by email',
    description: 'Updates user information using email as identifier',
  })
  @ApiParam({
    name: 'email',
    type: String,
    description: 'User email address',
    example: 'john.smith@example.com',
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'User update data',
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        fullnameTh: { type: 'string' },
        fullnameEn: { type: 'string' },
        about: { type: 'string' },
        phoneNumber: { type: 'string' },
        website: { type: 'string' },
        location: { type: 'string' },
        image: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data',
  })
  async updateUserByEmail(
    @Param('email') email: string,
    @Body() body: UpdateUserDto,
  ) {
    return this.usersService.updateUserByEmail(email, body);
  }
}
