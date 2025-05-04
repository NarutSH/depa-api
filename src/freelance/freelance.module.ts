import { Module } from '@nestjs/common';
import { FreelanceController } from './freelance.controller';
import { FreelanceService } from './freelance.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [FreelanceController],
  providers: [FreelanceService, PrismaService],
})
export class FreelanceModule {}
