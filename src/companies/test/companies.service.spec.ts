import { Test, TestingModule } from '@nestjs/testing';
import { jwtPayload } from '../../auth/jwt.payload';
import { LogsService } from '../../logs/logs.service';
import { CompaniesRepository } from '../companies.repository';
import { CompaniesService } from '../companies.service';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
jest.mock('../../logs/logs.service');
jest.mock('../companies.repository.ts');
describe('CompaniesService', () => {
  let service: CompaniesService;
  let companiesRepository: CompaniesRepository;
  let logsService: LogsService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompaniesService, LogsService, CompaniesRepository],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
    logsService = module.get<LogsService>(LogsService);
    companiesRepository = module.get<CompaniesRepository>(CompaniesRepository);
  });
  const user: jwtPayload = {
    userIndex: 'jroijfoirj23u8u23jro',
    status: false,
    accessLevel: false,
  };

  describe('findCompanyName', () => {
    const param = {
      companyName: '테스트회사이름',
    };
    it('회사 이름이 사용 중 일 때', async () => {
      companiesRepository.findCompanyName = jest.fn().mockReturnValue({
        index: '75d84bf4-cd53-40fe-98a3-b8e1ba528238',
        companyName: '테스트회사이름',
      });
      await expect(async () => {
        await service.findCompanyName(param);
      }).rejects.toThrowError(new ConflictException());
    });

    it('회사 이름이 사용 중이 아닐 때', async () => {
      companiesRepository.findCompanyName = jest.fn().mockReturnValue(null);
      await service.findCompanyName(param);
      expect(companiesRepository.findCompanyName).toBeCalledWith(
        param.companyName,
      );
    });
  });

  describe('joinCompany', () => {
    const param = { companyName: '테스트회사이름' };
    it('미리 가입 신청 한 경우 또는 가입된 회사가 있을 때 409 에러', async () => {
      companiesRepository.findCompanyName = jest.fn().mockReturnValue({
        index: '75d84bf4-cd53-40fe-98a3-b8e1ba528238',
        companyName: '테스트회사이름',
      });
      companiesRepository.findStaffClass = jest
        .fn()
        .mockReturnValue({ user: '2rjifoodnoii3h' });

      await expect(async () => {
        await service.joinCompany(user, param);
      }).rejects.toThrowError(new ConflictException());
    });
    it('가입하려는 회사가 존재 하지 않을 때 404에러', async () => {
      companiesRepository.findCompanyName = jest.fn().mockReturnValue(null);
      companiesRepository.findStaffClass = jest.fn().mockReturnValue(null);
      await expect(async () => {
        await service.joinCompany(user, param);
      }).rejects.toThrowError(new NotFoundException());
    });
    it('가입 신청 완료', async () => {
      companiesRepository.findCompanyName = jest.fn().mockReturnValue({
        index: '75d84bf4-cd53-40fe-98a3-b8e1ba528238',
        companyName: '테스트회사이름',
      });
      companiesRepository.findStaffClass = jest.fn().mockReturnValue(null);
      await service.joinCompany(user, param);

      expect(companiesRepository.joinCompany).toBeCalledWith(
        user.userIndex,
        '75d84bf4-cd53-40fe-98a3-b8e1ba528238',
        6,
      );
    });
  });

  describe('findCompanyList', () => {
    it('전체 회사 목록이 존재 할 때', async () => {
      const companyList = [
        {
          index: '75d84bf4-cd53-40fe-98a3-b8e1ba528238',
          companyName: 'companyTest1',
        },
        {
          index: '75d84bf4-cd53-40fe-1233-b8e1ba528238',
          companyName: 'companyTest2',
        },
        {
          index: '75d84bf4-cd53-40fe-af33-b8e1ba528238',
          companyName: 'companyTest3',
        },
      ];
      companiesRepository.findTotalCompany = jest
        .fn()
        .mockReturnValue(companyList);

      const result = await service.findCompanyList();
      expect(result).toBe(companyList);
    });

    it('전체 회사 목록이 존재 하지 않을 때', async () => {
      const companyList = [];
      companiesRepository.findTotalCompany = jest
        .fn()
        .mockReturnValue(companyList);

      const result = await service.findCompanyList();
      expect(result).toBe(companyList);
    });
  });

  describe('findCompanyStaffList', () => {
    it('가입된 회사가 없을 떄', async () => {
      companiesRepository.findStaffClass = jest.fn().mockReturnValue(null);

      await expect(async () => {
        await service.findCompanyStaffList(user);
      }).rejects.toThrowError(new NotFoundException());
    });

    it('가입 신청만 넣었을 때', async () => {
      const userData = {
        position: 6,
        companyIndex: '75d84bf4-cd53-40fe-98a3-b8e1ba528238',
      };
      companiesRepository.findStaffClass = jest.fn().mockReturnValue(userData);
      await expect(async () => {
        await service.findCompanyStaffList(user);
      }).rejects.toThrowError(new NotFoundException());
    });

    it('직원 목록 출력', async () => {
      const userData = {
        position: 3,
        companyIndex: '75d84bf4-cd53-40fe-98a3-b8e1ba528238',
      };
      const userList = [
        {
          position: 1,
          companyIndex: '67184bf4-cd53-40fe-98a3-b8e1ba528238',
        },
        {
          position: 5,
          companyIndex: '35d84bf4-cd53-40fe-98a3-b8e1ba528238',
        },
        {
          position: 2,
          companyIndex: '75d84bf4-cd53-40fe-98a3-b8e1ba528242',
        },
      ];
      companiesRepository.findStaffClass = jest.fn().mockReturnValue(userData);
      companiesRepository.findStaffList = jest.fn().mockReturnValue(userList);

      const result = await service.findCompanyStaffList(user);

      expect(result).toBe(userList);
    });
  });

  describe('leaveCompany', () => {
    it('소속된 회사가 없는 경우 404에러', async () => {
      companiesRepository.findStaffClass = jest.fn().mockReturnValue(null);
      await expect(async () => {
        await service.leaveCompany(user);
      }).rejects.toThrowError(new NotFoundException());
    });
    it('소속된 회사 사장일 경우 409 에러', async () => {
      const userData = {
        position: 1,
        companyIndex: '75d84bf4-cd53-40fe-98a3-b8e1ba528238',
      };
      companiesRepository.findStaffClass = jest.fn().mockReturnValue(userData);
      await expect(async () => {
        await service.leaveCompany(user);
      }).rejects.toThrowError(new ForbiddenException());
    });
    it('가입 취소, 탈퇴', async () => {
      const userData = {
        position: 3,
        companyIndex: '75d84bf4-cd53-40fe-98a3-b8e1ba528238',
      };
      companiesRepository.findStaffClass = jest.fn().mockReturnValue(userData);
      await service.leaveCompany(user);
      expect(companiesRepository.leaveCompany).toBeCalledWith(user.userIndex);
    });
  });

  describe('staffApplyList', () => {
    it('접속 유저가 사장이 아닌경우 (position !== 1) 403에러', async () => {
      const userData = {
        position: 3,
        companyIndex: '75d84bf4-cd53-40fe-98a3-b8e1ba528238',
      };
      companiesRepository.findStaffClass = jest.fn().mockReturnValue(userData);
      await expect(async () => {
        await service.staffApplyList(user);
      }).rejects.toThrowError(new ForbiddenException());
    });
    it('지원한 유저 목록 출력', async () => {
      const userData = {
        position: 1,
        companyIndex: '75d84bf4-cd53-40fe-98a3-b8e1ba528238',
      };
      const applyList = [
        {
          userIndex: '75d84jkf4-cd53-40fe-98a3-b8e1ba528218',
          id: 'testId1',
          nickname: 'testNick1',
          position: 6,
        },
        {
          userIndex: '75d84jkf4-cd53-40fe-98a3-b8e1ba528238',
          id: 'testId2',
          nickname: 'testNick2',
          position: 6,
        },
      ];
      companiesRepository.findStaffClass = jest.fn().mockReturnValue(userData);
      companiesRepository.findStaffList = jest.fn().mockReturnValue(applyList);
      const result = await service.staffApplyList(user);
      expect(result).toBe(applyList);
    });
  });

  describe('deleteCompany', () => {
    it('삭제하려는 유저가 사장이 아닐 때 403에러', async () => {
      const userData = {
        position: 3,
        companyIndex: '75d84bf4-cd53-40fe-98a3-b8e1ba528238',
      };
      companiesRepository.findStaffClass = jest.fn().mockReturnValue(userData);
      await expect(async () => {
        await service.deleteCompany(user);
      }).rejects.toThrowError(new ForbiddenException());
    });
    it('정상 삭제', async () => {
      const userData = {
        position: 1,
        companyIndex: '75d84bf4-cd53-40fe-98a3-b8e1ba528238',
      };
      companiesRepository.findStaffClass = jest.fn().mockReturnValue(userData);
      await service.deleteCompany(user);
      expect(companiesRepository.deleteCompany).toBeCalledWith(
        userData.companyIndex,
      );
    });
  });

  describe('promoteCompany', () => {
    const body = {
      position: 4,
      staffIndex: '75d84bf4-cd53-40fe-98a3-b8e1ba5286667',
    };
    it('사용자가 사장이 아닐 떄 (position !== 1) 403에러', async () => {
      const userData = {
        position: 2,
        companyIndex: '75d84bf4-cd53-40fe-98a3-b8e1ba528238',
      };
      companiesRepository.findStaffClass = jest.fn().mockReturnValue(userData);

      await expect(async () => {
        await service.promoteCompany(user, body);
      }).rejects.toThrowError(new ForbiddenException());
    });
    it('소속된 회원이 아닐 경우 404에러', async () => {
      const userData = {
        position: 1,
        companyIndex: '75d84bf4-cd53-40fe-98a3-b8e1ba528238',
      };
      companiesRepository.findStaffClass = jest
        .fn()
        .mockReturnValueOnce(userData)
        .mockReturnValueOnce(null);

      await expect(async () => {
        await service.promoteCompany(user, body);
      }).rejects.toThrowError(new NotFoundException());
    });
    it('사장이 변경 될 떄', async () => {
      const body = {
        position: 1,
        staffIndex: '75d84bf4-cd53-40fe-98a3-b8e1ba5286667',
      };
      const userData = {
        position: 1,
        companyIndex: '75d84bf4-cd53-40fe-98a3-b8e1ba528238',
      };
      const changeUser = {
        position: 3,
        companyIndex: '75d84bf4-cd53-40fe-98a3-b8e1ba528238',
      };
      companiesRepository.findStaffClass = jest
        .fn()
        .mockReturnValueOnce(userData)
        .mockReturnValueOnce(changeUser);

      await service.promoteCompany(user, body);

      expect(companiesRepository.updatePosition).toBeCalledTimes(2);
      expect(companiesRepository.updatePosition).toBeCalledWith(
        user.userIndex,
        changeUser.position,
      );
      expect(companiesRepository.updatePosition).toBeCalledWith(
        body.staffIndex,
        1,
      );
    });

    it('사장 직책이 아닌 다른 직책이 변경 될 떄', async () => {
      const body = {
        position: 5,
        staffIndex: '75d84bf4-cd53-40fe-98a3-b8e1ba5286667',
      };
      const userData = {
        position: 1,
        companyIndex: '75d84bf4-cd53-40fe-98a3-b8e1ba528238',
      };
      const changeUser = {
        position: 3,
        companyIndex: '75d84bf4-cd53-40fe-98a3-b8e1ba528238',
      };
      companiesRepository.findStaffClass = jest
        .fn()
        .mockReturnValueOnce(userData)
        .mockReturnValueOnce(changeUser);

      await service.promoteCompany(user, body);

      expect(companiesRepository.updatePosition).toBeCalledTimes(1);
      expect(companiesRepository.updatePosition).toBeCalledWith(
        body.staffIndex,
        5,
      );
    });
  });

  describe('deleteCompanyStaff', () => {
    const param = { userIndex: '75d84bf4-cd53-40fe-98a3-b8e1ba5286667' };
    it('사용자가 사장이 아닐 떄 (position !== 1) 403에러', async () => {
      const userData = {
        position: 2,
        companyIndex: '75d84bf4-cd53-40fe-98a3-b8e1ba528238',
      };
      companiesRepository.findStaffClass = jest.fn().mockReturnValue(userData);

      await expect(async () => {
        await service.deleteCompanyStaff(user, param);
      }).rejects.toThrowError(new ForbiddenException());
    });
    it('소속된 회원이 아닐 경우 404에러', async () => {
      const userData = {
        position: 1,
        companyIndex: '75d84bf4-cd53-40fe-98a3-b8e1ba528238',
      };
      companiesRepository.findStaffClass = jest
        .fn()
        .mockReturnValueOnce(userData)
        .mockReturnValueOnce(null);

      await expect(async () => {
        await service.deleteCompanyStaff(user, param);
      }).rejects.toThrowError(new NotFoundException());
    });
    it('회사 강제 퇴장', async () => {
      const userData = {
        position: 1,
        companyIndex: '75d84bf4-cd53-40fe-98a3-b8e1ba528238',
      };
      const changeUser = {
        position: 3,
        companyIndex: '75d84bf4-cd53-40fe-98a3-b8e1ba528238',
      };
      companiesRepository.findStaffClass = jest
        .fn()
        .mockReturnValueOnce(userData)
        .mockReturnValueOnce(changeUser);

      await service.deleteCompanyStaff(user, param);

      expect(companiesRepository.leaveCompany).toBeCalledWith(param.userIndex);
    });
  });

  describe.skip('createCompany', () => {
    it('', async () => {});
    it('', async () => {});
    it('', async () => {});
  });
});
