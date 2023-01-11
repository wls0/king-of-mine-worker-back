import { Test, TestingModule } from '@nestjs/testing';
import { jwtPayload } from '../../auth/jwt.payload';
import { CompaniesController } from '../companies.controller';
import { CompaniesService } from '../companies.service';
jest.mock('../companies.service.ts');
describe('CompaniesController', () => {
  let controller: CompaniesController;
  let companiesService: CompaniesService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompaniesController],
      providers: [CompaniesService],
    }).compile();
    companiesService = module.get<CompaniesService>(CompaniesService);
    controller = module.get<CompaniesController>(CompaniesController);
  });

  const user: jwtPayload = {
    userIndex: 'jroijfoirj23u8u23jro',
    status: false,
    accessLevel: false,
  };
  describe('findCompanyName', () => {
    it('서비스 findCompanyName 호출 확인', async () => {
      const param = { companyName: '회사 이름 ' };
      await controller.findCompanyName(param);
      expect(companiesService.findCompanyName).toBeCalledWith(param);
    });
  });

  describe('joinCompany', () => {
    it('서비스 joinCompany 호출 확인', async () => {
      const param = { companyName: '회사 이름 ' };
      await controller.joinCompany(user, param);
      expect(companiesService.joinCompany).toBeCalledWith(user, param);
    });
  });

  describe('findCompanyList', () => {
    it('서비스 findCompanyList 호출 확인', async () => {
      await controller.findCompanyList();
      expect(companiesService.findCompanyList).toBeCalledWith();
    });
  });
  describe('findCompanyStaffList', () => {
    it('서비스 findCompanyStaffList 호출 확인', async () => {
      await controller.findCompanyStaffList(user);
      expect(companiesService.findCompanyStaffList).toBeCalledWith(user);
    });
  });
  describe('leaveCompany', () => {
    it('서비스 leaveCompany 호출 확인', async () => {
      await controller.leaveCompany(user);
      expect(companiesService.leaveCompany).toBeCalledWith(user);
    });
  });
  describe('createCompany', () => {
    const body = {
      companyName: '회사이름',
      gold: 1000,
    };
    it('서비스 createCompany 호출 확인', async () => {
      await controller.createCompany(user, body);
      expect(companiesService.createCompany).toBeCalledWith(user, body);
    });
  });
  describe('staffApplyList', () => {
    it('서비스 staffApplyList 호출 확인', async () => {
      await controller.staffApplyList(user);
      expect(companiesService.staffApplyList).toBeCalledWith(user);
    });
  });

  describe('deleteCompany', () => {
    it('서비스 deleteCompany 호출 확인', async () => {
      await controller.deleteCompany(user);
      expect(companiesService.deleteCompany).toBeCalledWith(user);
    });
  });

  describe('promoteCompany', () => {
    const body = {
      position: 4,
      staffIndex: 'sdkjlkfjwijt2itp',
    };
    it('서비스 promoteCompany 호출 확인', async () => {
      await controller.promoteCompany(user, body);
      expect(companiesService.promoteCompany).toBeCalledWith(user, body);
    });
  });

  describe('deleteCompanyStaff', () => {
    const param = { userIndex: 'fnseoijroijifji24t' };
    it('서비스 deleteCompanyStaff 호출 확인', async () => {
      await controller.deleteCompanyStaff(user, param);
      expect(companiesService.deleteCompanyStaff).toBeCalledWith(user, param);
    });
  });
});
