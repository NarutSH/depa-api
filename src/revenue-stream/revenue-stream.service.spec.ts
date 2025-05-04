import { Test, TestingModule } from '@nestjs/testing';
import { RevenueStreamService } from './revenue-stream.service';

describe('RevenueStreamService', () => {
  let service: RevenueStreamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RevenueStreamService],
    }).compile();

    service = module.get<RevenueStreamService>(RevenueStreamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
