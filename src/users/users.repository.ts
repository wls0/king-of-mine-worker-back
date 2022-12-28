import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Model } from 'mongoose';
import { Logs } from '../model/logs.model';
import { Users } from '../model/users.model';
import { Stages } from '../model/stages.model';
import { Items } from '../model/items.model';
import { Gifts } from '../model/gifts.model';
import { GameRecords } from '../model/game-records.mode';
@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(Logs.name) private readonly logsModel: Model<Logs>,
    @InjectRepository(Users) private userRepository: Repository<Users>,
    @InjectRepository(Stages) private stagesRepository: Repository<Stages>,
    @InjectRepository(Items) private itemsRepository: Repository<Items>,
    @InjectRepository(GameRecords)
    private gameRecordsRepository: Repository<GameRecords>,
  ) {}

  async findUser(id: string) {
    return await this.userRepository
      .createQueryBuilder('users')
      .select(['users.userIndex'])
      .where('users.id = :id', { id })
      .getOne();
  }

  async createUser(data: { id: string; password: string; salt: string }) {
    const { id, password, salt } = data;
    const createUser = await this.userRepository
      .createQueryBuilder('users')
      .insert()
      .values({ id, password, salt })
      .execute();
    const userIndex = createUser.identifiers[0].userIndex;
    await Promise.all([
      this.stagesRepository
        .createQueryBuilder('stages')
        .insert()
        .values({ user: userIndex })
        .execute(),
      this.itemsRepository
        .createQueryBuilder('itmes')
        .insert()
        .values({ user: userIndex })
        .execute(),
      this.gameRecordsRepository
        .createQueryBuilder('game_records')
        .insert()
        .values({ user: userIndex })
        .execute(),
    ]);
  }

  async getUserLoginInfo(id: string) {
    return await this.userRepository
      .createQueryBuilder('users')
      .select(['users.userIndex', 'users.password', 'users.salt'])
      .where('users.id = :id', { id })
      .getOne();
  }
}
