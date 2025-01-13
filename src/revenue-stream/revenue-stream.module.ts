import { Module } from '@nestjs/common';
import { RevenueStreamService } from './revenue-stream.service';
import { RevenueStreamController } from './revenue-stream.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [RevenueStreamService, PrismaService],
  controllers: [RevenueStreamController],
})
export class RevenueStreamModule {}
