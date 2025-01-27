import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { ProviderService } from 'src/utils/provider';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [UploadController],
  providers: [UploadService, ProviderService, PrismaService],
})
export class UploadModule {}
