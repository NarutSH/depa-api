import { Module } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadModule } from 'src/upload/upload.module'; // Import UploadModule แทน UploadService
// import { ProviderService } from 'src/utils/provider';
import { QueryUtilsService } from 'src/utils/services/query-utils.service';

@Module({
  imports: [UploadModule], // Import UploadModule เพื่อใช้ UploadService
  controllers: [PortfolioController],
  providers: [
    PortfolioService,
    PrismaService,
    // UploadService, // ลบออกเพราะจะได้มาจาก UploadModule แล้ว
    // ProviderService,
    QueryUtilsService,
  ],
})
export class PortfolioModule {}
