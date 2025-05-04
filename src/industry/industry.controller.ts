import { Controller, Get } from '@nestjs/common';
import { IndustryService } from './industry.service';

@Controller('industry')
export class IndustryController {
  constructor(private readonly industryService: IndustryService) {}

  @Get()
  async getIndustries() {
    return this.industryService.getAll();
  }

  @Get('skills')
  async getSkills() {
    return this.industryService.getSkills();
  }
}
