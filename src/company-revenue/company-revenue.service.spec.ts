import { Test, TestingModule } from '@nestjs/testing';
import { CompanyRevenueService } from './company-revenue.service';

describe('CompanyRevenueService', () => {
  let service: CompanyRevenueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyRevenueService],
    }).compile();

    service = module.get<CompanyRevenueService>(CompanyRevenueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
