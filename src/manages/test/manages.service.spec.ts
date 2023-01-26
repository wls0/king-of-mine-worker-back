import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ManagesRepository } from '../manages.repository';
import { ManagesService } from '../manages.service';
jest.mock('../manages.repository.ts');
describe('ManagesService', () => {
  let service: ManagesService;
  let managesRepository: ManagesRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ManagesService, ManagesRepository],
    }).compile();

    service = module.get<ManagesService>(ManagesService);
    managesRepository = module.get<ManagesRepository>(ManagesRepository);
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
      const data = { status: false };
      managesRepository.findUserStatus = jest.fn().mockReturnValue(data);
      await service.deleteUser(param);
      expect(managesRepository.deleteUser).toBeCalledWith(param.id);
    });
  });
});
