import { Module } from '@nestjs/common';
import { LookingForService } from './looking-for.service';
import { LookingForController } from './looking-for.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [LookingForService, PrismaService],
  controllers: [LookingForController],
})
export class LookingForModule {}
