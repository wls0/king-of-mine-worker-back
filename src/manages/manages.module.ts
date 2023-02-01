import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsModule } from '../logs/logs.module';
import { CommunitiesModule } from '../communities/communities.module';
import { ManagesController } from './manages.controller';
import { ManagesRepository } from './manages.repository';
import { ManagesService } from './manages.service';
import { Stages } from '../model/stages.model';
import { Users } from '../model/users.model';
import { GamesModule } from '../games/games.module';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [
    CompaniesModule,
    CommunitiesModule,
    GamesModule,
    LogsModule,
    TypeOrmModule.forFeature([Stages, Users]),
  ],
  controllers: [ManagesController],
  providers: [ManagesService, ManagesRepository],
})
export class ManagesModule {}
