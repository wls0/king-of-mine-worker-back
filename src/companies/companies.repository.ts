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
      .select(['companies.companyName', 'companies.index'])
      .where('companies.companyName = :companyName', { companyName: name })
      .getOne();
  }

  async findStaffClass(user: string) {
    return await this.companyUsersRepository
      .createQueryBuilder('company_users')
      .select(['company_users.position', 'company_users.companyIndex'])
      .where('company_users.user = :user', { user })
      .getOne();
  }

  async joinCompany(userIndex: string, companyIndex: string, position: number) {
    await this.companyUsersRepository
      .createQueryBuilder('company_users')
      .insert()
      .values({ user: userIndex, companyIndex, position })
      .execute();
  }

  async findTotalCompany() {
    return await this.companiesRepository
      .createQueryBuilder('companies')
      .select(['companies.index', 'companies.companyName'])
      .getMany();
  }

  async findStaffList(companyIndex: string, join: boolean) {
    let where = 'company_users.position != :position';
    if (!join) {
      where = 'company_users.position = :position';
    }
    return await this.companyUsersRepository
      .createQueryBuilder('company_users')
      .select([
        'users.userIndex',
        'users.id',
        'users.nickname',
        'company_users.user',
        'company_users.position',
      ])
      .leftJoin('company_users.user', 'users')
      .where('company_users.companyIndex  = :companyIndex', { companyIndex })
      .andWhere(where, { position: 6 })
      .getMany();
  }

  async leaveCompany(user: string) {
    this.companyUsersRepository
      .createQueryBuilder('company_users')
      .delete()
      .where('company_users.user = :user', { user })
      .execute();
  }

  async createCompany(companyName: string) {
    const createdCompany = await this.companiesRepository.save({ companyName });
    return createdCompany.index;
  }

  async deleteCompany(companyIndex: string) {
    await this.companiesRepository
      .createQueryBuilder('companies')
      .delete()
      .where('companies.index = :index', { index: companyIndex })
      .execute();
  }

  async updatePosition(userIndex: string, position: number) {
    return await this.companyUsersRepository
      .createQueryBuilder('company_users')
      .update()
      .set({ position })
      .where('company_users.user = :user', { user: userIndex })
      .execute();
  }
}
