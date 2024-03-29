import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameRecords } from '../model/game-records.model';
import { Items } from '../model/items.model';
import { Stages } from '../model/stages.model';
import { LogsModule } from '../logs/logs.module';
import { CompanyUsers } from '../model/company-users.model';
import { GamesController } from './games.controller';
import { GamesRepository } from './games.repository';
import { GamesService } from './games.service';
import { Companies } from '../model/companies.model';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Companies,
      CompanyUsers,
      Stages,
      Items,
      GameRecords,
    ]),
    LogsModule,
    RedisModule,
  ],
  controllers: [GamesController],
  providers: [GamesService, GamesRepository],
  exports: [GamesService, GamesRepository],
})
export class GamesModule {}
