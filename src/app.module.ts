import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { CompanyModule } from './company/company.module';
import { RevenueStreamModule } from './revenue-stream/revenue-stream.module';
import { CompanyRevenueModule } from './company-revenue/company-revenue.module';

@Module({
  imports: [
    UsersModule,
    CompanyModule,
    RevenueStreamModule,
    CompanyRevenueModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
