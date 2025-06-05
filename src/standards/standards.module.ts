import { Module } from '@nestjs/common';
import { StandardsService } from './standards.service';
import { StandardsController } from './standards.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryUtilsService } from 'src/utils/services/query-utils.service';
import { UploadService } from 'src/upload/upload.service';

@Module({
  providers: [
    StandardsService,
    PrismaService,
    QueryUtilsService,
    UploadService,
  ],
  controllers: [StandardsController],
})
export class StandardsModule {}
