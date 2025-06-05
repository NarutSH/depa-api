import { Test, TestingModule } from '@nestjs/testing';
import { LookingForService } from './looking-for.service';

describe('LookingForService', () => {
  let service: LookingForService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LookingForService],
    }).compile();

    service = module.get<LookingForService>(LookingForService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
