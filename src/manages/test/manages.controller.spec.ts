import { Test, TestingModule } from '@nestjs/testing';
import { ManagesController } from '../manages.controller';

describe('ManagesController', () => {
  let controller: ManagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManagesController],
    }).compile();

    controller = module.get<ManagesController>(ManagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
