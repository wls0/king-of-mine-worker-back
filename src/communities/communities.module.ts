import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gifts } from '../model/gifts.model';
import { GamesModule } from '../games/games.module';
import { CommunitiesController } from './communities.controller';
import { CommunitiesRepository } from './communities.repository';
import { CommunitiesService } from './communities.service';

@Module({
  imports: [GamesModule, TypeOrmModule.forFeature([Gifts])],
  controllers: [CommunitiesController],
  providers: [CommunitiesService, CommunitiesRepository],
})
export class CommunitiesModule {}
