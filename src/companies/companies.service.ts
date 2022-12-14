import { Injectable } from '@nestjs/common';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { jwtPayload } from '../auth/jwt.payload';
import { CompaniesRepository } from './companies.repository';
import {
  CompanyCreateDto,
  CompanyNameDto,
  promoteCompanyDto,
  UserIndexDto,
} from './dto/companies.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly companiesRepository: CompaniesRepository) {}
  //회사 이름 찾기
  async findCompanyName(param: CompanyNameDto) {
    const { companyName } = param;

    const company = await this.companiesRepository.findCompanyName(companyName);
    if (company) {
      throw new ConflictException();
    } else {
      return '';
    }
  }
  //회사 가입신청
  async joinCompany(user: jwtPayload, param: CompanyNameDto) {
    const { companyName } = param;
    const { userIndex } = user;
    const [staff, company] = await Promise.all([
      this.companiesRepository.findStaffClass(userIndex),
      this.companiesRepository.findCompanyName(companyName),
    ]);
    if (staff) {
      throw new ConflictException();
    }
    if (!company) {
      throw new NotFoundException();
    }
    await this.companiesRepository.joinCompany(userIndex, company.index, 6);
    return '';
  }

  //전체 회사 목록
  async findCompanyList() {
    return await this.companiesRepository.findTotalCompany();
  }

  //가입된 회사 직원 목록
  async findCompanyStaffList(user: jwtPayload) {
    const { userIndex } = user;
    const companyCheck = await this.companiesRepository.findStaffClass(
      userIndex,
    );

    if (!companyCheck || companyCheck.position === 6) {
      throw new NotFoundException();
    }

    return await this.companiesRepository.findStaffList(
      companyCheck.companyIndex,
      true,
    );
  }

  //가입 취소 회사 탈퇴
  async leaveCompany(user: jwtPayload) {
    const { userIndex } = user;
    const staffClass = await this.companiesRepository.findStaffClass(userIndex);
    if (!staffClass) {
      throw new NotFoundException();
    } else if (staffClass.position === 1) {
      throw new ForbiddenException();
    }

    await this.companiesRepository.leaveCompany(userIndex);
    return '';
  }

  //회사 생성
  async createCompany(user: jwtPayload, body: CompanyCreateDto) {
    // 게임 골드 사용 코드 필요

    const { userIndex } = user;
    const { companyName, gold } = body;

    const company = await this.companiesRepository.createCompany(companyName);
    await this.companiesRepository.joinCompany(userIndex, company, 1);
    return '';
  }

  //회사에 지원한 유저 목록
  async staffApplyList(user: jwtPayload) {
    const { userIndex } = user;
    const staffClass = await this.companiesRepository.findStaffClass(userIndex);
    if (staffClass.position !== 1) {
      throw new ForbiddenException();
    }
    return await this.companiesRepository.findStaffList(
      staffClass.companyIndex,
      false,
    );
  }

  //회사 삭제
  async deleteCompany(user: jwtPayload) {
    const { userIndex } = user;
    const staffClass = await this.companiesRepository.findStaffClass(userIndex);
    if (staffClass.position !== 1) {
      throw new ForbiddenException();
    }
    await this.companiesRepository.deleteCompany(staffClass.companyIndex);
    return '';
  }

  //회사 직위 상승
  async promoteCompany(user: jwtPayload, body: promoteCompanyDto) {
    const { userIndex } = user;
    const { staffIndex, position } = body;

    const [companyCEOCheck, staffCheck] = await Promise.all([
      this.companiesRepository.findStaffClass(userIndex),
      this.companiesRepository.findStaffClass(staffIndex),
    ]);

    if (companyCEOCheck.position !== 1) {
      throw new ForbiddenException();
    }

    if (!staffCheck) {
      throw new NotFoundException();
    }

    if (position === 1) {
      await Promise.all([
        this.companiesRepository.updatePosition(staffIndex, position),
        this.companiesRepository.updatePosition(userIndex, staffCheck.position),
      ]);
    } else {
      await this.companiesRepository.updatePosition(staffIndex, position);
    }
    return '';
  }

  //회사 강제 퇴장
  async deleteCompanyStaff(user: jwtPayload, param: UserIndexDto) {
    const { userIndex } = user;
    const staffIndex = param.userIndex;

    const [companyCEOCheck, staffCheck] = await Promise.all([
      this.companiesRepository.findStaffClass(userIndex),
      this.companiesRepository.findStaffClass(staffIndex),
    ]);

    if (companyCEOCheck.position !== 1) {
      throw new ForbiddenException();
    }
    if (!staffCheck) {
      throw new NotFoundException();
    }

    await this.companiesRepository.leaveCompany(staffIndex);
    return '';
  }
}
