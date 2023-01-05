import { Injectable } from '@nestjs/common';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import e from 'express';
import { jwtPayload } from '../users/jwt/jwt.payload';
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
  async findCompanyName(param: CompanyNameDto) {
    const { companyName } = param;

    const company = await this.companiesRepository.findCompanyName(companyName);
    if (company) {
      throw new ConflictException();
    } else {
      return '';
    }
  }

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

  async findCompanyList() {
    return await this.companiesRepository.findTotalCompany();
  }

  async findCompanyStaffList(user: jwtPayload) {
    const { userIndex } = user;
    const companyCheck = await this.companiesRepository.findStaffClass(
      userIndex,
    );

    if (!companyCheck) {
      throw new NotFoundException();
    }

    return await this.companiesRepository.findStaffList(
      companyCheck.companyIndex,
      true,
    );
  }

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

  async createCompany(user: jwtPayload, body: CompanyCreateDto) {
    // 게임 골드 사용 코드 필요

    const { userIndex } = user;
    const { companyName, gold } = body;

    await this.companiesRepository.createCompany(companyName);
    return '';
  }

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

  async deleteCompany(user: jwtPayload) {
    const { userIndex } = user;
    const staffClass = await this.companiesRepository.findStaffClass(userIndex);
    if (staffClass.position !== 1) {
      throw new ForbiddenException();
    }
    await this.companiesRepository.deleteCompany(staffClass.companyIndex);
    return '';
  }

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
        this.companiesRepository.updatePosition(staffCheck.user, position),
        this.companiesRepository.updatePosition(
          companyCEOCheck.user,
          staffCheck.position,
        ),
      ]);
    } else {
      await this.companiesRepository.updatePosition(staffCheck.user, position);
    }
    return '';
  }

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

    await this.companiesRepository.leaveCompany(staffCheck.user);
    return '';
  }
}
