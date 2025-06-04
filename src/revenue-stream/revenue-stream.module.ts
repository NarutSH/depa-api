import { Module } from '@nestjs/common';
import { RevenueStreamService } from './revenue-stream.service';
import { RevenueStreamController } from './revenue-stream.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryUtilsService } from 'src/utils/services/query-utils.service';

@Module({
  providers: [RevenueStreamService, PrismaService, QueryUtilsService],
  controllers: [RevenueStreamController],
})
export class RevenueStreamModule {}
