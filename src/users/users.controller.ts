import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import CreateUserDto from './dtos/create-user.dto';
import UpdateUserDto from './dtos/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }
  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string) {
    return this.usersService.getUserByEmail(email);
  }

  @Post()
  async createUser(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body);
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() body: CreateUserDto) {
    return this.usersService.updateUser(id, body);
  }

  @Patch('email/:email')
  async updateUserByEmail(
    @Param('email') email: string,
    @Body() body: UpdateUserDto,
  ) {
    return this.usersService.updateUserByEmail(email, body);
  }
}
