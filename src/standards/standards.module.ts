import { Module } from '@nestjs/common';
import { StandardsService } from './standards.service';
import { StandardsController } from './standards.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryUtilsService } from 'src/utils/services/query-utils.service';
import { UploadModule } from 'src/upload/upload.module'; // Import UploadModule แทน UploadService

@Module({
  imports: [UploadModule], // Import UploadModule เพื่อใช้ UploadService
  providers: [
    StandardsService,
    PrismaService,
    QueryUtilsService,
    // UploadService, // ลบออกเพราะจะได้มาจาก UploadModule แล้ว
  ],
  controllers: [StandardsController],
})
export class StandardsModule {}
