import { Test, TestingModule } from '@nestjs/testing';
import { ManagesService } from '../manages.service';

describe('ManagesService', () => {
  let service: ManagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ManagesService],
    }).compile();

    service = module.get<ManagesService>(ManagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
