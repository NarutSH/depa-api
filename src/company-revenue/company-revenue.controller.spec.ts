import { Test, TestingModule } from '@nestjs/testing';
import { CompanyRevenueController } from './company-revenue.controller';

describe('CompanyRevenueController', () => {
  let controller: CompanyRevenueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyRevenueController],
    }).compile();

    controller = module.get<CompanyRevenueController>(CompanyRevenueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
