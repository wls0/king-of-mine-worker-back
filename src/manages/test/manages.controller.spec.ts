import { Test, TestingModule } from '@nestjs/testing';
import { UserStatusSettingDTO } from '../dto/manages.dto';
import { ManagesController } from '../manages.controller';
import { ManagesService } from '../manages.service';
jest.mock('../manages.service.ts');
describe('ManagesController', () => {
  let controller: ManagesController;
  let managesService: ManagesService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManagesController],
      providers: [ManagesService],
    }).compile();

    controller = module.get<ManagesController>(ManagesController);
    managesService = module.get<ManagesService>(ManagesService);
  });

  describe('findStageInfo', () => {
    const param = { stage: 3 };
    it('managesService.findStageInfo 호출 확인', async () => {
      await controller.findStageInfo(param);
      expect(managesService.findStageInfo).toBeCalledWith(param);
    });
  });

  describe('createStage', () => {
    const body = {
      coal: 10,
      bronze: 4,
      silver: 2,
      emerald: 5,
      amethyst: 0,
      diamond: 1,
      lithium: 2,
      useDynamite: 2,
    };
    it('managesService.createStage 호출 확인', async () => {
      await controller.createStage(body);
      expect(managesService.createStage).toBeCalledWith(body);
    });
  });

  describe('updateStageInfo', () => {
    const body = {
      coal: 10,
      bronze: 4,
      silver: 2,
      emerald: 5,
      amethyst: 0,
      diamond: 1,
      lithium: 2,
      useDynamite: 2,
      stage: 4,
    };
    it('managesService.updateStageInfo 호출 확인', async () => {
      await controller.updateStageInfo(body);
      expect(managesService.updateStageInfo).toBeCalledWith(body);
    });
  });

  describe('findUserStatus', () => {
    const body = {
      id: '검색유저아이디',
    };
    it('managesService.findUserStatus 호출 확인', async () => {
      await controller.findUserStatus(body);
      expect(managesService.findUserStatus).toBeCalledWith(body);
    });
  });

  describe('updateUserStatus', () => {
    const body: UserStatusSettingDTO = {
      id: '검색유저아이디',
      status: true,
    };
    it('managesService.updateUserStatus 호출 확인', async () => {
      await controller.updateUserStatus(body);
      expect(managesService.updateUserStatus).toBeCalledWith(body);
    });
  });

  describe('deleteUser', () => {
    const body = {
      id: '검색유저아이디',
    };
    it('managesService.deleteUser 호출 확인', async () => {
      await controller.deleteUser(body);
      expect(managesService.deleteUser).toBeCalledWith(body);
    });
  });
});
