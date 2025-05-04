import { Module } from '@nestjs/common';
import { StandardsService } from './standards.service';
import { StandardsController } from './standards.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [StandardsService, PrismaService],
  controllers: [StandardsController],
})
export class StandardsModule {}
