import { Test, TestingModule } from '@nestjs/testing';
import { LoginSocketsGateway } from '../login-sockets.gateway';

describe('LoginSocketsGateway', () => {
  let gateway: LoginSocketsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoginSocketsGateway],
    }).compile();

    gateway = module.get<LoginSocketsGateway>(LoginSocketsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
