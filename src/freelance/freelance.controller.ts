import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { FreelanceService } from './freelance.service';
import { CreateFreelanceDto } from './dto/create-freelance.dto';

@Controller('freelance')
export class FreelanceController {
  constructor(private readonly freelanceService: FreelanceService) {}

  @Get()
  async getAl(@Query('industry') industry: string) {
    return this.freelanceService.getAl(industry);
  }

  @Get('/user/:userId')
  async getByUserId(@Param('userId') userId: string) {
    return this.freelanceService.getByUserId(userId);
  }

  @Post()
  async create(@Body() data: CreateFreelanceDto) {
    return this.freelanceService.create(data);
  }

  @Get('/juristic/:juristicId')
  async getByJuristicId(@Param('juristicId') juristicId: string) {
    return this.freelanceService.getByJuristicId(juristicId);
  }
}
