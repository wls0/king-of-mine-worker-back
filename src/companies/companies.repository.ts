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
}
