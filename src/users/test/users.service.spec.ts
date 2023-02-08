import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { UsersRepository } from '../users.repository';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LogsService } from '../../logs/logs.service';
import { passwordMaker } from '../utils/util';
import { jwtPayload } from '../../auth/jwt.payload';
jest.mock('../users.repository.ts');
jest.mock('../../logs/logs.service');

process.env.CRYPTO = process.env.CRYPTO;
process.env.JWT = process.env.JWT;
describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: UsersRepository;
  let logsService: LogsService;
  let jwtService: JwtService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, UsersRepository, JwtService, LogsService],
    }).compile();
    jwtService = new JwtService();
    usersRepository = module.get<UsersRepository>(UsersRepository);
    service = module.get<UsersService>(UsersService);
    logsService = module.get<LogsService>(LogsService);
  });

  describe('findId', () => {
    const param = {
      id: 'test',
    };
    it('type is function', () => {
      expect(typeof service.findId).toBe('function');
    });

    it('존재하는 아이디 일 때 409에러', async () => {
      usersRepository.findUser = jest
        .fn()
        .mockReturnValue({ userIndex: '32u42348', id: 'test' });
      await expect(async () => {
        await service.findId(param);
      }).rejects.toThrowError(new ConflictException());
    });

    it('존재하지 않는 아이디 일 때 성공', async () => {
      usersRepository.findUser = jest.fn().mockReturnValue(null);
      const result = await service.findId(param);
      expect(result).toBe('');
    });
  });

  describe('createUser', () => {
    const body = { id: 'test', password: '1234pwd' };
    it('존재하는 아이디가 있을 때', async () => {
      usersRepository.findUser = jest
        .fn()
        .mockReturnValue({ userIndex: '32u42348', id: 'test' });
      await expect(async () => {
        await service.createUser(body);
      }).rejects.toThrowError(new ConflictException());
    });

    it('존재하는 아이디가 없고 유저 정상 생성', async () => {
      usersRepository.findUser = jest.fn().mockReturnValue(null);
      usersRepository.createUser = jest.fn().mockReturnValue('userindex123');
      await service.createUser(body);
      expect(usersRepository.createUser).toBeCalledTimes(1);
      const saveLog = {
        type: 'account',
        log: { title: 'createAccount' },
      };
      expect(logsService.saveLog).toBeCalledWith('userindex123', saveLog);
    });
  });

  describe('login', () => {
    const body = {
      id: 'test',
      password: '1234pwd',
    };
    const { makePassword, salt } = passwordMaker('1234pwd');
    it('아이디가 존재 하지 않을 때 401에러', async () => {
      usersRepository.getUserLoginInfo = jest.fn().mockReturnValue(null);
      await expect(async () => {
        await service.login(body);
      }).rejects.toThrowError(new UnauthorizedException());
    });
    it('비밀번호가 틀렸을 때 401에러', async () => {
      const user = { id: body.id, password: '234234', salt };
      usersRepository.getUserLoginInfo = jest.fn().mockReturnValue(user);
      await expect(async () => {
        await service.login(body);
      }).rejects.toThrowError(new UnauthorizedException());
    });

    it('정상 작동', async () => {
      const user = {
        userIndex: '123432index',
        id: body.id,
        password: makePassword,
        salt,
        status: true,
        accessLevel: true,
      };
      usersRepository.getUserLoginInfo = jest.fn().mockReturnValue(user);
      service.redis.set = jest.fn();
      service.redis.expire = jest.fn();
      const result = await service.login(body);
      jwtService.sign(
        {
          userIndex: user.userIndex,
          status: user.status,
          accessLevel: user.accessLevel,
        },
        { secret: process.env.JWT },
      );
      const saveLog = {
        type: 'account',
        log: { title: 'login' },
      };
      expect(result).toBe(result);
      expect(logsService.saveLog).toBeCalledWith(user.userIndex, saveLog);
      expect(service.redis.set).toBeCalledWith(user.userIndex, '');
      expect(service.redis.expire).toBeCalledWith(user.userIndex, 1000 * 60 * 60 * 24);
    });
  });

  describe('findNickname', () => {
    const body = {
      nickname: 'testnick',
    };
    it('닉네임이 존재 할 때', async () => {
      usersRepository.findNickname = jest.fn().mockReturnValue('testnick');
      await expect(async () => {
        await service.findNickname(body);
      }).rejects.toThrowError(new ConflictException());
    });
    it('닉네임이 존재 하지 않을 때 (정상 작동)', async () => {
      usersRepository.findNickname = jest.fn().mockReturnValue(null);
      const result = await service.findNickname(body);
      expect(result).toBe('');
    });
  });

  describe('changeNickname', () => {
    const user: jwtPayload = {
      userIndex: 'userindex',
      status: true,
      accessLevel: true,
    };
    const body = {
      nickname: 'testnick',
    };
    it('닉네임이 존재 할 때', async () => {
      usersRepository.findNickname = jest.fn().mockReturnValue('testnick');
      await expect(async () => {
        await service.changeNickname(user, body);
      }).rejects.toThrowError(new ConflictException());
    });
    it('닉네임 정상 변경', async () => {
      usersRepository.findNickname = jest.fn().mockReturnValue(null);
      const result = await service.changeNickname(user, body);
      expect(result).toBe('');
    });
  });
});
