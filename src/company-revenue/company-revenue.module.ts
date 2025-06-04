import { Module } from '@nestjs/common';
import { CompanyRevenueService } from './company-revenue.service';
import { CompanyRevenueController } from './company-revenue.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryUtilsService } from 'src/utils/services/query-utils.service';

@Module({
  providers: [CompanyRevenueService, PrismaService, QueryUtilsService],
  controllers: [CompanyRevenueController],
})
export class CompanyRevenueModule {}
