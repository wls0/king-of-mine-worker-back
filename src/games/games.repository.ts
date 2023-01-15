import { Injectable } from '@nestjs/common';
import { Stages } from '../model/stages.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameRecords } from '../model/game-records.model';
import { Items } from '../model/items.model';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
@Injectable()
export class GamesRepository {
  constructor(
    @InjectRepository(Stages) private stagesRepository: Repository<Stages>,
    @InjectRepository(GameRecords)
    private gameRecordsRepository: Repository<GameRecords>,
    @InjectRepository(Items)
    private itemsRepository: Repository<Items>,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async findUserGameInfo(user: string) {
    return await this.gameRecordsRepository
      .createQueryBuilder('game_records')
      .select(['game_records.stage', 'game_records.level', 'game_records.exp'])
      .where('game_records.user = :user', { user })
      .getOne();
  }

  async findStageInfo(stage: number) {
    return await this.stagesRepository
      .createQueryBuilder('stages')
      .select([
        'stages.coal',
        'stages.bronze',
        'stage.silver',
        'stage.emerald',
        'stages.amethyst',
        'stages.diamond',
        'stage.lithium',
        'stage.useDynamite',
      ])
      .where('stages.stage = :stage', { stage })
      .getOne();
  }

  async findHaveUserItem(user: string) {
    return await this.itemsRepository
      .createQueryBuilder('items')
      .select([
        'items.drill',
        'items.oxygenRespirator',
        'items.dynamite',
        'items.coworker',
        'items.gold',
      ])
      .where('items.user = :user', { user })
      .getOne();
  }

  async useGold(user: string, gold: number) {
    return await this.itemsRepository
      .createQueryBuilder('items')
      .update()
      .set({ gold })
      .where('items.user = :user', { user })
      .execute();
  }

  async updateUserPlayGame(
    user: string,
    save: { stage: number; level: number; exp: number },
  ) {
    const { stage, level, exp } = save;
    return await this.gameRecordsRepository
      .createQueryBuilder('game_records')
      .update()
      .set({ stage, level, exp })
      .where('items.user = :user', { user })
      .execute();
  }

  async upgradeItem(
    user: string,
    save: {
      category: string;
      itemLevel: number;
    },
  ) {
    const { category, itemLevel } = save;
    return await this.gameRecordsRepository
      .createQueryBuilder('items')
      .update()
      .set({ [`${category}`]: itemLevel })
      .where('items.user = :user', { user })
      .execute();
  }

  async findCompanyRank(companyIndex: string) {
    await this.redis.zrange('companyRank', 0, -1, 'WITHSCORES');
  }
}
