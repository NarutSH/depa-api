import { Test, TestingModule } from '@nestjs/testing';
import { RevenueStreamController } from './revenue-stream.controller';

describe('RevenueStreamController', () => {
  let controller: RevenueStreamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RevenueStreamController],
    }).compile();

    controller = module.get<RevenueStreamController>(RevenueStreamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
