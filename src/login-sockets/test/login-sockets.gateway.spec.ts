import { Test, TestingModule } from '@nestjs/testing';
import { LoginSocketsGateway } from '../login-sockets.gateway';
import { LoginSocketsService } from '../login-sockets.service';
jest.mock('../login-sockets.service.ts');

describe('LoginSocketsGateway', () => {
  let gateway: LoginSocketsGateway;
  let service: LoginSocketsService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoginSocketsGateway, LoginSocketsService],
    }).compile();

    gateway = module.get<LoginSocketsGateway>(LoginSocketsGateway);
    service = module.get<LoginSocketsService>(LoginSocketsService);
  });

  const id = 'cdsgrgerhfs';

  describe('handleDisconnect', () => {
    it('서비스 disconnect 호출 확인', async () => {
      await gateway.handleDisconnect({ id });
      expect(service.disconnect).toBeCalledWith(id);
    });
  });
});
