import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CompanyService } from './company.service';
import CreateCompanyDto from './dto/create-company.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  async getAl() {
    return this.companyService.getAl();
  }

  @Get('user/:userId')
  async getByUserId(@Param('userId') userId: string) {
    return this.companyService.getByUserId(userId);
  }

  @Post()
  async create(@Body() data: CreateCompanyDto) {
    return this.companyService.create(data);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: CreateCompanyDto) {
    return this.companyService.update(id, data);
  }

  @Patch('juristic/:juristicId')
  async updateByJuristic(
    @Param('juristicId') juristicId: string,
    @Body() data: CreateCompanyDto,
  ) {
    return this.companyService.updateByJuristic(juristicId, data);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    console.log(id);
    return this.companyService.getById(id);
  }

  @Get('juristic/:juristicId')
  async getByJuristicId(@Param('juristicId') juristicId: string) {
    return this.companyService.getByJuristicId(juristicId);
  }
}
