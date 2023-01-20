import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsModule } from '../logs/logs.module';
import { GamesModule } from '../games/games.module';
import { ManagesController } from './manages.controller';
import { ManagesRepository } from './manages.repository';
import { ManagesService } from './manages.service';
import { Stages } from 'src/model/stages.model';
import { Gifts } from 'src/model/gifts.model';
import { Users } from '../model/users.model';

@Module({
  imports: [
    GamesModule,
    LogsModule,
    TypeOrmModule.forFeature([Stages, Gifts, Users]),
  ],
  controllers: [ManagesController],
  providers: [ManagesService, ManagesRepository],
})
export class ManagesModule {}
