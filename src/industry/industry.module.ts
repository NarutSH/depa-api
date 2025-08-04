import { Module } from '@nestjs/common';
import {
  IndustryController,
  SkillController,
  TagController,
  ChannelController,
  CategoryController,
  SourceController,
  SegmentController,
  ProjectTagController,
  StandardsController,
  LookingForController,
} from './controllers';
import { IndustryService } from './industry.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [
    IndustryController,
    SkillController,
    TagController,
    ChannelController,
    CategoryController,
    SourceController,
    SegmentController,
    ProjectTagController,
    StandardsController,
    LookingForController,
  ],
  providers: [IndustryService, PrismaService],
})
export class IndustryModule {}
