import { Test, TestingModule } from '@nestjs/testing';
import { GamesService } from '../games.service';
import { GamesRepository } from '../games.repository';
import { LogsService } from '../../logs/logs.service';
import { jwtPayload } from '../../auth/jwt.payload';
import { UseGoldDTO } from '../dto/games.dto';
import { ForbiddenException } from '@nestjs/common';

jest.mock('../../logs/logs.service.ts');
jest.mock('../games.repository.ts');

describe('GamesService', () => {
  let service: GamesService;
  let gamesRepository: GamesRepository;
  let logsService: LogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GamesService, LogsService, GamesRepository],
    }).compile();

    service = module.get<GamesService>(GamesService);
    logsService = module.get<LogsService>(LogsService);
    gamesRepository = module.get<GamesRepository>(GamesRepository);
  });

  const user: jwtPayload = {
    userIndex: 'jroijfoirj23u8u23jro',
    status: false,
    accessLevel: false,
  };

  describe('findStage()', () => {
    it('호출 확인 gamesRepository.findUserGameInfo', async () => {
      await service.findStage(user);
      expect(gamesRepository.findUserGameInfo).toBeCalledWith(user.userIndex);
    });
  });

  describe('findStageLevelInfo()', () => {
    const param = { stage: 3 };
    it('호출 확인 gamesRepository.findStageInfo', async () => {
      await service.findStageLevelInfo(param);
      expect(gamesRepository.findStageInfo).toBeCalledWith(param.stage);
    });
  });

  describe('useGold()', () => {
    it('골드가 부족 할 때 403 에러 출력', async () => {
      const useGold: UseGoldDTO = {
        use: false,
        type: 'stage',
        log: '',
        gold: 300,
      };

      service.findItem = jest.fn().mockReturnValue({ gold: 200 });
      await expect(async () => {
        await service.useGold(user, useGold);
      }).rejects.toThrowError(new ForbiddenException());
    });
    it('정상 작동', async () => {
      const useGold: UseGoldDTO = {
        use: true,
        type: 'stage',
        log: '',
        gold: 300,
      };
      service.findItem = jest.fn().mockReturnValue({ gold: 200 });
      await service.useGold(user, useGold);
      expect(gamesRepository.useGold).toBeCalledWith(user.userIndex, 500);
    });
  });

  describe('playGame()', () => {
    const gold = 0.34;
    beforeEach(() => {
      jest.spyOn(global.Math, 'random').mockReturnValue(gold);
    });
    const stageInfo = {
      coal: 20,
      bronze: 10,
      silver: 11,
      emerald: 15,
      amethyst: 13,
      diamond: 3,
      lithium: 2,
    };
    it('스테이지 통과 만큼 광물을 채집 하지 않았을 때 403 에러', async () => {
      const body = {
        stage: 3,
        coal: 20,
        bronze: 10,
        silver: 11,
        emerald: 15,
        amethyst: 1,
        diamond: 0,
        lithium: 0,
      };
      gamesRepository.findStageInfo = jest.fn().mockReturnValue(stageInfo);
      await expect(async () => {
        await service.playGame(user, body);
      }).rejects.toThrowError(new ForbiddenException());
    });
    it('스테이지 클리어 (정상 작동 레벨 업)', async () => {
      const body = {
        stage: 3,
        coal: 20,
        bronze: 10,
        silver: 11,
        emerald: 15,
        amethyst: 13,
        diamond: 3,
        lithium: 4,
      };

      gamesRepository.findStageInfo = jest.fn().mockReturnValue(stageInfo);
      gamesRepository.findUserGameInfo = jest
        .fn()
        .mockReturnValue({ level: 1, exp: 100 });
      service.useGold = jest.fn();
      await service.playGame(user, body);
      expect(service.useGold).toBeCalledWith(user, {
        gold: 202,
        use: true,
        type: 'stage',
        log: undefined,
      });
      expect(gamesRepository.updateUserPlayGame).toBeCalledWith(
        user.userIndex,
        { stage: 4, level: 2, exp: 0 },
      );

      jest.spyOn(global.Math, 'random').mockRestore();
    });

    it('스테이지 클리어 (정상 작동 경험치 만 획득)', async () => {
      const body = {
        stage: 3,
        coal: 20,
        bronze: 10,
        silver: 11,
        emerald: 15,
        amethyst: 13,
        diamond: 3,
        lithium: 4,
      };

      gamesRepository.findStageInfo = jest.fn().mockReturnValue(stageInfo);
      gamesRepository.findUserGameInfo = jest
        .fn()
        .mockReturnValue({ level: 1, exp: 50 });
      service.useGold = jest.fn();
      await service.playGame(user, body);
      expect(service.useGold).toBeCalledWith(user, {
        gold: 202,
        use: true,
        type: 'stage',
        log: undefined,
      });
      expect(gamesRepository.updateUserPlayGame).toBeCalledWith(
        user.userIndex,
        { stage: 4, level: 1, exp: 100 },
      );

      jest.spyOn(global.Math, 'random').mockRestore();
    });
  });

  describe('findCompanyRank()', () => {
    const companyList = [
      '1번회사인덱스',
      '20',
      '2번회사인덱스',
      '17',
      '3번회사인덱스',
      '10',
    ];
    const companyName = ['1번회사', '2번회사', '3번회사'];
    it('본인이 소속된 회사가 있을 때', async () => {
      gamesRepository.findCompanyInfo = jest
        .fn()
        .mockReturnValue({ companyIndex: '3번회사인덱스' });
      gamesRepository.findCompanyRank = jest.fn().mockReturnValue(companyList);
      gamesRepository.findCompanyName = jest
        .fn()
        .mockReturnValueOnce(companyName[0])
        .mockReturnValueOnce(companyName[1])
        .mockReturnValueOnce(companyName[2]);

      const result = await service.findCompanyRank(user);

      let companyListCount = 0;
      const resultBox = [];
      for (const b of companyList) {
        resultBox.push({ companyName: companyList[companyListCount] });
        b.companyName = companyList[companyListCount];
        b.point = companyPointBox[companyListCount];
        companyListCount++;
      }

      expect(result).toBeCalledWith({ companyBox, myCompany: companyIndex });
    });
    it('본인이 소속된 회사가 없을 때', async () => {});
  });

  describe('updateCompanyRank()', () => {
    it('', async () => {});
    it('', async () => {});
    it('', async () => {});
  });

  describe('findItem()', () => {
    it('', async () => {});
    it('', async () => {});
    it('', async () => {});
  });

  describe('upgradeItem()', () => {
    it('', async () => {});
    it('', async () => {});
    it('', async () => {});
  });
});
