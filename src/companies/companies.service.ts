import { Injectable } from '@nestjs/common';
import { ConflictException } from '@nestjs/common/exceptions';
import { jwtPayload } from '../users/jwt/jwt.payload';
import { CompaniesRepository } from './companies.repository';
import {
  CompanyCreateDto,
  CompanyNameDto,
  CompanyPromoteDto,
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

  async joinCompany(user: jwtPayload, param: CompanyNameDto) {}

  async companyList() {}

  async companyStaffList(user: jwtPayload) {}

  async companyLeave(user: jwtPayload) {}

  async createCompany(user: jwtPayload, body: CompanyCreateDto) {}

  async staffApplyList(user: jwtPayload) {}

  async deleteCompany(user: jwtPayload) {}

  async companyPromote(user: jwtPayload, body: CompanyPromoteDto) {}

  async deleteCompanyStaff(user: jwtPayload, param: UserIndexDto) {}
}
