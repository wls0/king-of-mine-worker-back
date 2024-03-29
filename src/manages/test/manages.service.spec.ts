import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ManagesRepository } from '../manages.repository';
import { ManagesService } from '../manages.service';
import { GamesRepository } from '../../games/games.repository';
import { CompaniesRepository } from '../../companies/companies.repository';
import { passwordMaker } from '../../users/utils/util';
import { JwtService } from '@nestjs/jwt';
jest.mock('../../games/games.repository.ts');
jest.mock('../../companies/companies.repository.ts');
jest.mock('../manages.repository.ts');
process.env.CRYPTO = process.env.CRYPTO;
process.env.JWT = process.env.JWT;
describe('ManagesService', () => {
  let service: ManagesService;
  let managesRepository: ManagesRepository;
  let gamesRepository: GamesRepository;
  let companiesRepository: CompaniesRepository;
  let jwtService: JwtService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ManagesService,
        ManagesRepository,
        GamesRepository,
        CompaniesRepository,
        JwtService,
      ],
    }).compile();
    jwtService = new JwtService();
    service = module.get<ManagesService>(ManagesService);
    managesRepository = module.get<ManagesRepository>(ManagesRepository);
    gamesRepository = module.get<GamesRepository>(GamesRepository);
    companiesRepository = module.get<CompaniesRepository>(CompaniesRepository);
  });

  describe('findStageInfo', () => {
    const param = { stage: 3 };
    it('managesRepository.findStageInfo 호출 확인', async () => {
      await service.findStageInfo(param);
      expect(managesRepository.findStageInfo).toBeCalledWith(param.stage);
    });
  });

  describe('createStage', () => {
    const body = {
      coal: 10,
      bronze: 2,
      silver: 4,
      emerald: 1,
      amethyst: 0,
      diamond: 2,
      lithium: 4,
      useDynamite: 2,
    };
    it('정상 작동', async () => {
      await service.createStage(body);
      expect(managesRepository.createStage).toBeCalledWith(body);
    });
  });

  describe('updateStageInfo', () => {
    const body = {
      coal: 10,
      bronze: 2,
      silver: 4,
      emerald: 1,
      amethyst: 0,
      diamond: 2,
      lithium: 4,
      useDynamite: 2,
      stage: 2,
    };
    it('스테이지가 없을 때 404 에러', async () => {
      managesRepository.findStageInfo = jest.fn().mockReturnValue(null);
      await expect(async () => {
        await service.updateStageInfo(body);
      }).rejects.toThrowError(new NotFoundException());
    });
    it('정상 작동', async () => {
      const data = {
        coal: 3,
        bronze: 2,
        silver: 4,
        emerald: 1,
        amethyst: 0,
        diamond: 2,
        lithium: 4,
        useDynamite: 2,
      };
      managesRepository.findStageInfo = jest.fn().mockReturnValue(data);
      await service.updateStageInfo(body);
      expect(managesRepository.updateStageInfo).toBeCalledWith(body);
    });
  });

  describe('findUserStatus', () => {
    const param = {
      id: '찾는유저인덱스',
    };
    it('managesRepository.findUserStatus 호출 확인', async () => {
      await service.findUserStatus(param);
      expect(managesRepository.findUserStatus).toBeCalledWith(param.id);
    });
  });

  describe('updateUserStatus', () => {
    const body = { id: '변경유저인덱스', status: true };
    it('유저가 없는 경우 404에러 출력', async () => {
      managesRepository.findUserStatus = jest.fn().mockReturnValue(null);
      await expect(async () => {
        await service.updateUserStatus(body);
      }).rejects.toThrowError(new NotFoundException());
    });
    it('정상 작동', async () => {
      const data = { status: false };
      managesRepository.findUserStatus = jest.fn().mockReturnValue(data);
      await service.updateUserStatus(body);
      expect(managesRepository.updateUserStatus).toBeCalledWith(body);
    });
  });

  describe('deleteUser', () => {
    const param = { id: '삭제하려는유저인덱스' };
    it('삭제하려는 유저가 없을 때 404에러 발생', async () => {
      managesRepository.findUserStatus = jest.fn().mockReturnValue(null);
      await expect(async () => {
        await service.deleteUser(param);
      }).rejects.toThrowError(new NotFoundException());
    });

    it('정상 작동', async () => {
      const data = { status: false, userIndex: '유저인덱스' };
      managesRepository.findUserStatus = jest.fn().mockReturnValue(data);
      await service.deleteUser(param);
      expect(managesRepository.deleteUser).toBeCalledWith(
        param.id,
        data.userIndex,
      );
    });
  });

  describe('weeklyCompanyRankReward', () => {
    it('게임을 진행한 회사가 없을 때', async () => {
      gamesRepository.findCompanyRank = jest.fn().mockReturnValue(null);
      await service.weeklyCompanyRankReward();
      expect(companiesRepository.findStaffList).not.toBeCalled();
      expect(managesRepository.sendCompanyRankReward).not.toBeCalled();
    });

    it('1. 정상작동 1위 회사가 1곳 일 때', async () => {
      const companyList = ['1번회사', 20, '2번회사', 10, '3번회사', 1];
      const userList = [
        { user: '1번회사유저1' },
        { user: '1번회사유저2' },
        { user: '1번회사유저3' },
      ];
      gamesRepository.findCompanyRank = jest.fn().mockReturnValue(companyList);
      companiesRepository.findStaffList = jest
        .fn()
        .mockReturnValueOnce(userList);
      await service.weeklyCompanyRankReward();
      expect(managesRepository.sendCompanyRankReward).toBeCalledTimes(3);
      expect(managesRepository.sendCompanyRankReward).toBeCalledWith(
        userList[0].user,
      );
      expect(managesRepository.sendCompanyRankReward).toBeCalledWith(
        userList[1].user,
      );
      expect(managesRepository.sendCompanyRankReward).toBeCalledWith(
        userList[2].user,
      );
      expect(managesRepository.deleteRank).toBeCalled();
    });

    it('2. 정상작동 1위 회사가 1곳 이상 일 때', async () => {
      const companyList = ['1번회사', 20, '2번회사', 20, '3번회사', 1];
      const userList1 = [
        { user: '1번회사유저1' },
        { user: '1번회사유저2' },
        { user: '1번회사유저3' },
      ];
      const userList2 = [
        { user: '2번회사유저1' },
        { user: '2번회사유저2' },
        { user: '2번회사유저3' },
      ];
      gamesRepository.findCompanyRank = jest.fn().mockReturnValue(companyList);
      companiesRepository.findStaffList = jest
        .fn()
        .mockReturnValueOnce(userList1)
        .mockReturnValueOnce(userList2);
      await service.weeklyCompanyRankReward();
      expect(managesRepository.sendCompanyRankReward).toBeCalledTimes(6);
      expect(managesRepository.deleteRank).toBeCalled();
    });
  });
  describe('onApplicationBootstrap', () => {
    it('관리자 계정이 없을 때', async () => {
      managesRepository.managerFind = jest.fn().mockReturnValue(null);
      await service.onApplicationBootstrap();
      expect(managesRepository.managerCraete).toBeCalled();
    });

    it('관리자 계정이 있을 때', async () => {
      managesRepository.managerFind = jest.fn().mockReturnValue({
        id: 'manager',
        password: '123sdasd',
        salt: 'sdfjls;kdfj',
      });
      await service.onApplicationBootstrap();
      expect(managesRepository.managerCraete).not.toBeCalled();
    });
  });
  describe('managerLogin', () => {
    it('아이디가 틀렸을 때', async () => {
      const body = {
        id: 'manager1',
        password: '1234',
      };
      managesRepository.managerFind = jest.fn().mockReturnValue(null);
      await expect(async () => {
        await service.managerLogin(body);
      }).rejects.toThrowError(new UnauthorizedException());
    });
    it('비밀번호가 틀렸을 때', async () => {
      const body = {
        id: process.env.MANAGER_ID,
        password: '1234',
      };
      managesRepository.managerFind = jest.fn().mockReturnValue({
        id: process.env.MANAGER_ID,
        password: '1234',
        salt: '1234',
      });
      await expect(async () => {
        await service.managerLogin(body);
      }).rejects.toThrowError(new UnauthorizedException());
    });
    it('정상 작동', async () => {
      const id = process.env.MANAGER_ID;
      const password = process.env.MANAGER_PWD;
      const body = {
        id,
        password,
      };
      const { makePassword, salt } = passwordMaker(password);
      const manager = {
        userIndex: '123432index',
        id,
        password: makePassword,
        salt,
        status: true,
        accessLevel: false,
      };
      managesRepository.managerFind = jest.fn().mockReturnValue(manager);
      const token = jwtService.sign(
        {
          userIndex: manager.userIndex,
          status: manager.status,
          accessLevel: manager.accessLevel,
        },
        { secret: process.env.JWT },
      );
      const result = await service.managerLogin(body);
      expect(result).toBe(token);
    });
  });
});
