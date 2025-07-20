import {
  Controller,
  Body,
  Get,
  Post,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { LookingForService } from './looking-for.service';
import {
  CreateLookingForDto,
  UpdateLookingForDto,
} from './dto/looking-for.dto';
import { LookingFor } from '../../generated/prisma/index';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('looking-for')
export class LookingForController {
  constructor(private readonly lookingForService: LookingForService) {}

  @Post()
  async create(@Body() data: CreateLookingForDto): Promise<LookingFor> {
    return this.lookingForService.create(data);
  }

  @Get()
  @Public()
  async findAll(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('search') search?: string,
    @Query('industrySlug') industrySlug?: string,
  ): Promise<LookingFor[]> {
    const where: any = {};
    if (search) where.name = { contains: search, mode: 'insensitive' };
    if (industrySlug) where.industrySlug = industrySlug;
    return this.lookingForService.findAll({ skip, take, where });
  }

  @Get('all')
  @Public()
  async findAllNoPaginate(): Promise<LookingFor[]> {
    return this.lookingForService.findAll({});
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<LookingFor | null> {
    return this.lookingForService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateLookingForDto,
  ): Promise<LookingFor> {
    return this.lookingForService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<LookingFor> {
    return this.lookingForService.delete(id);
  }
}
