import { Test, TestingModule } from '@nestjs/testing';
import { LookingForController } from './looking-for.controller';

describe('LookingForController', () => {
  let controller: LookingForController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LookingForController],
    }).compile();

    controller = module.get<LookingForController>(LookingForController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
