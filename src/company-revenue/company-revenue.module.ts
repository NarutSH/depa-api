import { Module } from '@nestjs/common';
import { CompanyRevenueService } from './company-revenue.service';
import { CompanyRevenueController } from './company-revenue.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [CompanyRevenueService, PrismaService],
  controllers: [CompanyRevenueController],
})
export class CompanyRevenueModule {}
