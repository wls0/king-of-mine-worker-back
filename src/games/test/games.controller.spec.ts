import { Test, TestingModule } from '@nestjs/testing';
import { jwtPayload } from '../../auth/jwt.payload';
import { CompanyRankDTO, UpgradeItemDTO } from '../dto/games.dto';
import { GamesController } from '../games.controller';
import { GamesService } from '../games.service';
jest.mock('../games.service.ts');
describe('GamesController', () => {
  let controller: GamesController;
  let gamesService: GamesService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamesController],
      providers: [GamesService],
    }).compile();

    controller = module.get<GamesController>(GamesController);
    gamesService = module.get<GamesService>(GamesService);
  });

  const user: jwtPayload = {
    userIndex: 'jroijfoirj23u8u23jro',
    status: false,
    accessLevel: false,
  };

  describe('findStage', () => {
    it('서비스 findStage 호출 확인', async () => {
      await controller.findStage(user);
      expect(gamesService.findStage).toBeCalled();
    });
  });

  describe('findStageLevelInfo', () => {
    const param = { stage: 3 };
    it('서비스 findStageLevelInfo 호출 확인', async () => {
      await controller.findStageLevelInfo(param);
      expect(gamesService.findStageLevelInfo).toBeCalledWith(param);
    });
  });

  describe('playGame', () => {
    const body = {
      stage: 3,
      coal: 2,
      bronze: 1,
      silver: 7,
      emerald: 1,
      amethyst: 9,
      diamond: 5,
      lithium: 2,
    };
    it('서비스 playGame 호출 확인', async () => {
      await controller.playGame(user, body);
      expect(gamesService.playGame).toBeCalledWith(user, body);
    });
  });

  describe('findItem', () => {
    it('서비스 findItem 호출 확인', async () => {
      await controller.findItem(user);
      expect(gamesService.findItem).toBeCalledWith(user);
    });
  });

  describe('upgradeItem', () => {
    const body: UpgradeItemDTO = { category: 'drill' };
    it('서비스 upgradeItem 호출 확인', async () => {
      await controller.upgradeItem(user, body);
      expect(gamesService.upgradeItem).toBeCalledWith(user, body);
    });
  });

  describe('findCompanyRank', () => {
    it('서비스 findCompanyRank 호출 확인', async () => {
      await controller.findCompanyRank(user);
      expect(gamesService.findCompanyRank).toBeCalledWith(user);
    });
  });

  describe('updateCompanyRank', () => {
    const body: CompanyRankDTO = {
      point: 3,
    };
    it('서비스 updateCompanyRank 호출 확인', async () => {
      await controller.updateCompanyRank(user, body);
      expect(gamesService.updateCompanyRank).toBeCalledWith(user, body);
    });
  });
});
