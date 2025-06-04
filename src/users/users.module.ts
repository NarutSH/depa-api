import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryUtilsService } from 'src/utils/services/query-utils.service';

@Module({
  controllers: [UsersController],
  providers: [PrismaService, UsersService, QueryUtilsService],
  exports: [UsersService],
})
export class UsersModule {}
