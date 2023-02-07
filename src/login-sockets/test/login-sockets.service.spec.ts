import { Test, TestingModule } from '@nestjs/testing';
import { LoginSocketsService } from '../login-sockets.service';

describe('LoginSocketsService', () => {
  let service: LoginSocketsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoginSocketsService],
    }).compile();

    service = module.get<LoginSocketsService>(LoginSocketsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
