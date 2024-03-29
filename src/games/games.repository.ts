import { Injectable } from '@nestjs/common';
import { Stages } from '../model/stages.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameRecords } from '../model/game-records.model';
import { Items } from '../model/items.model';
import { CompanyUsers } from '../model/company-users.model';
import { Companies } from '../model/companies.model';
import dayjs from 'dayjs';
import { RedisService } from '../redis/redis.service';
@Injectable()
export class GamesRepository {
  constructor(
    @InjectRepository(Stages) private stagesRepository: Repository<Stages>,
    @InjectRepository(GameRecords)
    private gameRecordsRepository: Repository<GameRecords>,
    @InjectRepository(Items)
    private itemsRepository: Repository<Items>,
    @InjectRepository(CompanyUsers)
    private companyUsersRepository: Repository<CompanyUsers>,
    @InjectRepository(Companies)
    private companiesRepository: Repository<Companies>,
    private redis: RedisService,
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

  async findCompanyRank() {
    const now = new Date();
    const day = now.getDay();
    const setDate = dayjs(now.setDate(now.getDate() - day)).format('MM/DD');
    return await this.redis.zrange({
      name: `${setDate}/companyRank`,
      start: 0,
      end: -1,
      optionStatus: true,
    });
  }

  async findMyCompanyPoint(companyIndex: string) {
    const now = new Date();
    const day = now.getDay();
    const setDate = dayjs(now.setDate(now.getDate() - day)).format('MM/DD');
    return await this.redis.zscore({
      name: `${setDate}/companyRank`,
      index: companyIndex,
    });
  }

  async updateCompanyRank(data: { companyIndex: string; point: number }) {
    const { companyIndex, point } = data;
    const now = new Date();
    const day = now.getDay();
    const setDate = dayjs(now.setDate(now.getDate() - day)).format('MM/DD');
    await this.redis.zadd({
      name: `${setDate}/companyRank`,
      point,
      index: companyIndex,
    });
    await this.redis.expire({
      name: `${setDate}/companyRank`,
      time: 1000 * 60 * 60 * 24 * 10,
    });
  }

  async findCompanyInfo(user: string) {
    return await this.companyUsersRepository
      .createQueryBuilder('company_users')
      .select(['companyIndex'])
      .leftJoin('company_users.companyIndex', 'companies')
      .where('company_users.user = :user', { user })
      .getRawOne();
  }

  async findCompanyName(companyIndex: string) {
    const result = await this.companiesRepository
      .createQueryBuilder('companies')
      .select(['companies.companyName'])
      .where('companies.index = :companyIndex', { companyIndex })
      .getOne();
    return result.companyName;
  }
}
