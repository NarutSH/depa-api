import { Test, TestingModule } from '@nestjs/testing';
import { FreelanceService } from './freelance.service';

describe('FreelanceService', () => {
  let service: FreelanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FreelanceService],
    }).compile();

    service = module.get<FreelanceService>(FreelanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
