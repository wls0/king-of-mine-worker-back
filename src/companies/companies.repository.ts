import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Companies } from '../model/companies.model';
import { CompanyUsers } from '../model/company-users.model';
import { Repository } from 'typeorm';

@Injectable()
export class CompaniesRepository {
  constructor(
    @InjectRepository(Companies)
    private companiesRepository: Repository<Companies>,
    @InjectRepository(CompanyUsers)
    private companyUsersRepository: Repository<CompanyUsers>,
  ) {}

  async findCompanyName(name: string) {
    return await this.companiesRepository
      .createQueryBuilder('companies')
      .select(['companies.companyName'])
      .where('companies.companyName = :companyName', { companyName: name })
      .getOne();
  }

  async findStaffClass(user: string) {
    return await this.companyUsersRepository
      .createQueryBuilder('company-users')
      .select(['company-users.user'])
      .where('company-users.user = :user', { user })
      .getOne();
  }

  async joinCompany(userIndex: string, companyIndex: string, position: number) {
    await this.companyUsersRepository
      .createQueryBuilder('company-users')
      .insert()
      .values({ user: userIndex, companyIndex, position })
      .execute();
  }

  async findTotalCompany() {
    return await this.companiesRepository
      .createQueryBuilder('companies')
      .select(['companies'])
      .getMany();
  }

  async findStaffList(companyIndex: string, join: boolean) {
    let where = 'company-users.position :position != 6';
    if (!join) {
      where = 'company-users.position :position = 6';
    }
    return await this.companyUsersRepository
      .createQueryBuilder('company-users')
      .select(['company-users.user', 'company-users.position'])
      .where(where)
      .getMany();
  }

  async leaveCompany(user: string) {
    await this.companyUsersRepository
      .createQueryBuilder('company-users')
      .delete()
      .where('company-users.user = :user', { user });
  }

  async createCompany(companyName: string) {
    await this.companiesRepository.save({ companyName });
  }

  async deleteCompany(companyIndex: string) {
    await this.companiesRepository
      .createQueryBuilder('companies')
      .delete()
      .where('companies.index = :index', { index: companyIndex });
  }

  async updatePosition(userIndex: string, position: number) {
    return await this.companyUsersRepository
      .createQueryBuilder('company-users')
      .update()
      .set({ position })
      .where('userIndex.user = :userIndex', { userIndex })
      .execute();
  }
}
