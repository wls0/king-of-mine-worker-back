import { Test, TestingModule } from '@nestjs/testing';
import { jwtPayload } from '../../auth/jwt.payload';
import { GamesService } from '../../games/games.service';
import { CommunitiesRepository } from '../communities.repository';
import { CommunitiesService } from '../communities.service';
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
    it('', async () => {});
    it('', async () => {});
    it('', async () => {});
  });

  describe('receiveGift', () => {
    it('', async () => {});
    it('', async () => {});
    it('', async () => {});
  });
});
