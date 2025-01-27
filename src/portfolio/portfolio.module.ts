import { Module } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';
import { ProviderService } from 'src/utils/provider';

@Module({
  controllers: [PortfolioController],
  providers: [PortfolioService, PrismaService, UploadService, ProviderService],
})
export class PortfolioModule {}
