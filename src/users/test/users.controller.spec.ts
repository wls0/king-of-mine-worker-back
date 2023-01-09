import { Test, TestingModule } from '@nestjs/testing';
import { jwtPayload } from 'src/auth/jwt.payload';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
jest.mock('../users.service.ts');
describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('findId', () => {
    const param = {
      id: 'userId',
    };
    it('Type is function', async () => {
      expect(typeof controller.findId).toBe('function');
    });
    it('호출 확인 usersService.findId', async () => {
      await controller.findId(param);
      expect(usersService.findId).toBeCalledWith(param);
    });
  });

  describe('createUser', () => {
    const body = {
      id: 'userId',
      password: 'pwd123',
    };
    it('Type is function', async () => {
      expect(typeof controller.createUser).toBe('function');
    });
    it('호출 확인 usersService.createUser', async () => {
      await controller.createUser(body);
      expect(usersService.createUser).toBeCalledWith(body);
    });
  });
  describe('login', () => {
    const body = {
      id: 'userId',
      password: 'pwd123',
    };
    it('Type is function', async () => {
      expect(typeof controller.login).toBe('function');
    });
    it('호출 확인 usersService.login', async () => {
      await controller.login(body);
      expect(usersService.login).toBeCalledWith(body);
    });
  });

  describe('findNickname', () => {
    const param = {
      nickname: 'userNickname',
    };
    it('Type is function', async () => {
      expect(typeof controller.findNickname).toBe('function');
    });
    it('호출 확인 usersService.findNickname', async () => {
      await controller.findNickname(param);
      expect(usersService.findNickname).toBeCalledWith(param);
    });
  });

  describe('changeNickname', () => {
    const body = {
      nickname: 'userNickname',
    };
    const user: jwtPayload = {
      userIndex: '346erghgrtu6u4',
      status: false,
      accessLevel: false,
    };
    it('Type is function', async () => {
      expect(typeof controller.changeNickname).toBe('function');
    });
    it('호출 확인 usersService.changeNickname', async () => {
      await controller.changeNickname(user, body);
      expect(usersService.changeNickname).toBeCalledWith(user, body);
    });
  });
});
