import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { jwtPayload } from '../../auth/jwt.payload';
import { GamesService } from '../../games/games.service';
import { CommunitiesRepository } from '../communities.repository';
import { CommunitiesService } from '../communities.service';
import { SendGoldDTO } from '../dto/communities.dto';
jest.mock('../../games/games.service.ts');
jest.mock('../communities.repository.ts');
describe('CommunitiesService', () => {
  let service: CommunitiesService;
  let communitiesRepository: CommunitiesRepository;
  let gamesService: GamesService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommunitiesService, CommunitiesRepository, GamesService],
    }).compile();

    service = module.get<CommunitiesService>(CommunitiesService);
    communitiesRepository = module.get<CommunitiesRepository>(
      CommunitiesRepository,
    );
    gamesService = module.get<GamesService>(GamesService);
  });
  const user: jwtPayload = {
    userIndex: 'jroijfoirj23u8u23jro',
    status: false,
    accessLevel: false,
  };
  describe('findSendGiftList', () => {
    const gift = [
      {
        index: '선물인덱스1',
        sendUser: user.userIndex,
        receiveUser: '받은이인덱스2',
        gold: 200,
        message: '메시지 전송1',
        status: false,
      },
      {
        index: '선물인덱스1',
        sendUser: user.userIndex,
        receiveUser: '받은이인덱스2',
        gold: 100,
        message: '메시지 전송2',
        status: true,
      },
      {
        index: '선물인덱스1',
        sendUser: user.userIndex,
        receiveUser: '받은이인덱스2',
        gold: 500,
        message: '메시지 전송3',
        status: false,
      },
    ];
    it('보낸 선물 목록 존재 할 때 (정상 호출)', async () => {
      communitiesRepository.findSendGiftList = jest.fn().mockReturnValue(gift);
      const result = await service.findSendGiftList(user);
      expect(result).toEqual(gift);
    });
    it('보낸 선물 목록 존재 하지 않을 때(정상 호출)', async () => {
      communitiesRepository.findSendGiftList = jest.fn().mockReturnValue([]);
      const result = await service.findSendGiftList(user);
      expect(result).toEqual([]);
    });
  });

  describe('findReceiveGiftList', () => {
    it('받을 선물 목록 존재 할 때 (정상 호출)', async () => {
      const gift = [
        {
          index: '선물인덱스1',
          sendUser: '전송이인덱스2',
          receiveUser: user.userIndex,
          gold: 200,
          message: '메시지 전송1',
          status: false,
        },
        {
          index: '선물인덱스1',
          sendUser: '전송이인덱스2',
          receiveUser: user.userIndex,
          gold: 100,
          message: '메시지 전송2',
          status: true,
        },
        {
          index: '선물인덱스1',
          sendUser: '전송이인덱스2',
          receiveUser: user.userIndex,
          gold: 500,
          message: '메시지 전송3',
          status: false,
        },
      ];
      communitiesRepository.findReceiveGiftList = jest
        .fn()
        .mockReturnValue(gift);
      const result = await service.findReceiveGiftList(user);
      expect(result).toEqual(gift);
    });
    it('받을 선물 목록 존재 하지 않을 때 (정상 호출)', async () => {
      communitiesRepository.findReceiveGiftList = jest.fn().mockReturnValue([]);
      const result = await service.findReceiveGiftList(user);
      expect(result).toEqual([]);
    });
  });

  describe('sendGift', () => {
    const body: SendGoldDTO = {
      gold: 300,
      receiveUser: '선물받는유저인덱스1',
      message: '메시지1',
    };
    it('같은 회사소속이 아닐 때 403에러', async () => {
      communitiesRepository.findCompanyUser = jest
        .fn()
        .mockReturnValueOnce({ companyIndex: 'sendUserCompanyIndex' })
        .mockReturnValueOnce({ companyIndex: 'receiveUserCompanyIndex' });
      await expect(async () => {
        await service.sendGift(user, body);
      }).rejects.toThrowError(new ForbiddenException());
    });
    it('정상 작동', async () => {
      communitiesRepository.findCompanyUser = jest
        .fn()
        .mockReturnValue({ companyIndex: 'companyIndex' });
      await service.sendGift(user, body);
      expect(gamesService.useGold).toBeCalledWith(user, {
        gold: 300,
        use: false,
        type: 'company',
        log: undefined,
      });
      expect(communitiesRepository.sendGift).toBeCalledWith(
        user.userIndex,
        body,
      );
    });
  });

  describe('receiveGift', () => {
    const body = {
      giftIndex: '선물인덱스1',
    };
    it('없는 선물 인덱스 일 때 404 에러', async () => {
      communitiesRepository.findGiftInfo = jest.fn().mockReturnValue(null);
      await expect(async () => {
        await service.receiveGift(user, body);
      }).rejects.toThrowError(new NotFoundException());
    });
    it('선물 받는이가 다를 때 403에러', async () => {
      communitiesRepository.findGiftInfo = jest.fn().mockReturnValue({
        receiveUser: '다른받는이인덱스',
        status: false,
        gold: 500,
      });
      await expect(async () => {
        await service.receiveGift(user, body);
      }).rejects.toThrowError(new ForbiddenException());
    });
    it('선물 받는 상태가 받은 상태 (true)일 때', async () => {
      communitiesRepository.findGiftInfo = jest.fn().mockReturnValue({
        receiveUser: user.userIndex,
        status: true,
        gold: 500,
      });
      await expect(async () => {
        await service.receiveGift(user, body);
      }).rejects.toThrowError(new ForbiddenException());
    });

    it('정상 작동', async () => {
      communitiesRepository.findGiftInfo = jest.fn().mockReturnValue({
        receiveUser: user.userIndex,
        status: false,
        gold: 500,
      });
      await service.receiveGift(user, body);
      expect(gamesService.useGold).toBeCalledWith(user, {
        gold: 500,
        use: true,
        type: 'company',
        log: undefined,
      });
      expect(communitiesRepository.receiveGift).toBeCalledWith(body.giftIndex);
    });
  });
});
