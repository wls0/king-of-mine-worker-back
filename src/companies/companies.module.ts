import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesModule } from '../games/games.module';
import { LogsModule } from '../logs/logs.module';
import { Companies } from '../model/companies.model';
import { CompanyUsers } from '../model/company-users.model';
import { CompaniesController } from './companies.controller';
import { CompaniesRepository } from './companies.repository';
import { CompaniesService } from './companies.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Companies, CompanyUsers]),
    LogsModule,
    GamesModule,
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService, CompaniesRepository],
  exports: [CompaniesRepository],
})
export class CompaniesModule {}
