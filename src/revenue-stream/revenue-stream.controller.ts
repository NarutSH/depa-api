import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RevenueStreamService } from './revenue-stream.service';
import { CreateRevenueStreamDto } from './dto/create-revenue-stream.dto';

@Controller('revenue-stream')
export class RevenueStreamController {
  constructor(private readonly revenueStreamService: RevenueStreamService) {}

  @Get()
  async getAl() {
    return this.revenueStreamService.getAll();
  }

  @Get('company/:companyId')
  async getByCompanyId(@Param('companyId') companyId: string) {
    return this.revenueStreamService.getByCompanyId(companyId);
  }

  @Post()
  async create(@Body() datas: CreateRevenueStreamDto[]) {
    for (const data of datas) {
      await this.revenueStreamService.create(data);
    }
  }
}
