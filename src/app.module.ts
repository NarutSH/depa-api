import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
import { AuthModule } from './auth/auth.module';
import { PingController } from './ping/ping.controller';
import { UtilsModule } from './utils/utils.module';
import { ChannelModule } from './channel/channel.module';
import { LookingForModule } from './looking-for/looking-for.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      // envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
    }),
    UsersModule,
    CompanyModule,
    RevenueStreamModule,
    CompanyRevenueModule,
    PortfolioModule,
    StandardsModule,
    UploadModule,
    IndustryModule,
    FreelanceModule,
    AuthModule,
    UtilsModule,
    ChannelModule,
    LookingForModule,
  ],
  controllers: [PingController],
  providers: [PrismaService],
})
export class AppModule {}
