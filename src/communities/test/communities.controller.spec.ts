import { Test, TestingModule } from '@nestjs/testing';
import { jwtPayload } from '../../auth/jwt.payload';
import { CommunitiesController } from '../communities.controller';
import { CommunitiesService } from '../communities.service';
import { SendGoldDTO } from '../dto/communities.dto';
jest.mock('../communities.service.ts');
describe('CommunitiesController', () => {
  let controller: CommunitiesController;
  let communitiesService: CommunitiesService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommunitiesController],
      providers: [CommunitiesService],
    }).compile();

    controller = module.get<CommunitiesController>(CommunitiesController);
    communitiesService = module.get<CommunitiesService>(CommunitiesService);
  });
  const user: jwtPayload = {
    userIndex: 'jroijfoirj23u8u23jro',
    status: false,
    accessLevel: false,
  };
  describe('findSendGiftList', () => {
    it('communitiesService.findSendGiftList 호출 확인', async () => {
      await controller.findSendGiftList(user);
      expect(communitiesService.findSendGiftList).toBeCalledWith(user);
    });
  });

  describe('findReceiveGiftList', () => {
    it('communitiesService.findReceiveGiftList 호출 확인', async () => {
      await controller.findReceiveGiftList(user);
      expect(communitiesService.findReceiveGiftList).toBeCalledWith(user);
    });
  });

  describe('sendGift', () => {
    const body: SendGoldDTO = {
      gold: 300,
      receiveUser: '선물받는유저인덱스',
      message: '선물메시지',
    };
    it('communitiesService.sendGift 호출 확인', async () => {
      await controller.sendGift(user, body);
      expect(communitiesService.sendGift).toBeCalledWith(user, body);
    });
  });

  describe('receiveGift', () => {
    const body = { giftIndex: '선물정보인덱스' };
    it('communitiesService.receiveGift 호출 확인', async () => {
      await controller.receiveGift(user, body);
      expect(communitiesService.receiveGift).toBeCalledWith(user, body);
    });
  });
});
