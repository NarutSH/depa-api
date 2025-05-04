import { Body, Controller, Get, Post } from '@nestjs/common';
import { CompanyRevenueService } from './company-revenue.service';
import { CreateCompanyRevenueDto } from './dto/create-company-revenue.dto';

@Controller('company-revenue')
export class CompanyRevenueController {
  constructor(private readonly companyRevenueService: CompanyRevenueService) {}

  @Get()
  async getAll() {
    return this.companyRevenueService.getAll();
  }

  @Get('company/:companyId')
  async getByCompanyId(companyId: string) {
    return this.companyRevenueService.getByCompanyId(companyId);
  }

  @Post()
  async create(@Body() data: CreateCompanyRevenueDto) {
    return this.companyRevenueService.create(data);
  }
}
