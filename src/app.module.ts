import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { CompanyModule } from './company/company.module';
import { RevenueStreamModule } from './revenue-stream/revenue-stream.module';
import { CompanyRevenueModule } from './company-revenue/company-revenue.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { StandardsModule } from './standards/standards.module';
import { UploadModule } from './upload/upload.module';
import { IndustryModule } from './industry/industry.module';
import { FreelanceModule } from './freelance/freelance.module';

@Module({
  imports: [
    UsersModule,
    CompanyModule,
    RevenueStreamModule,
    CompanyRevenueModule,
    PortfolioModule,
    StandardsModule,
    UploadModule,
    IndustryModule,
    FreelanceModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
