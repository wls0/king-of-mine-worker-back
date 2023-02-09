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
  const socketId = '소켓id';
  const userIndex = '유저인덱스';
  describe('login', () => {
    it('인덱스를 보내지 않을 때', async () => {
      const result = await service.login(socketId, '');
      expect(result).toEqual({
        event: 'error',
        data: null,
        message: 'userIndex is null',
        socket: socketId,
      });
    });
    it('중복 접속을 했을 경우', async () => {
      service.redis.get = jest.fn().mockReturnValue('다른소켓id');
      service.redis.del = jest.fn();
      service.redis.set = jest.fn();
      const result = await service.login(socketId, { userIndex });
      expect(result).toEqual({
        event: 'error',
        data: null,
        message: 'duplicate login',
        socket: '다른소켓id',
      });
      expect(service.redis.del).toBeCalledWith('다른소켓id');
      expect(service.redis.set).toBeCalledWith(userIndex, '');
    });
    it('정상 작동', async () => {
      service.redis.get = jest.fn().mockReturnValue('');
      service.redis.del = jest.fn();
      service.redis.set = jest.fn();
      service.redis.expire = jest.fn();
      const result = await service.login(socketId, { userIndex });
      expect(result).toEqual({
        event: 'loginSuccess',
        data: null,
        message: '',
        socket: socketId,
      });
      expect(service.redis.set).toBeCalledWith(userIndex, socketId);
      expect(service.redis.set).toBeCalledWith(socketId, userIndex);
      expect(service.redis.expire).toBeCalledWith(
        userIndex,
        1000 * 60 * 60 * 24,
      );
    });
  });

  describe('disconnect', () => {
    it('redis 호출 확인', async () => {
      service.redis.get = jest.fn().mockReturnValue(userIndex);
      service.redis.del = jest.fn();
      await service.disconnect(socketId);
      expect(service.redis.get).toBeCalledWith(socketId);
      expect(service.redis.del).toBeCalledWith(socketId);
      expect(service.redis.del).toBeCalledWith(userIndex);
    });
  });
});
