import { Controller, Get } from '@nestjs/common';
import { StandardsService } from './standards.service';

@Controller('standards')
export class StandardsController {
  constructor(private readonly standardsService: StandardsService) {}

  @Get()
  async getStandards() {
    return this.standardsService.getStandards();
  }
}
