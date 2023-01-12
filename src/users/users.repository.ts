import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../model/users.model';
import { Items } from '../model/items.model';
import { GameRecords } from '../model/game-records.model';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
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

    return userIndex;
  }

  async getUserLoginInfo(id: string) {
    return await this.userRepository
      .createQueryBuilder('users')
      .select([
        'users.userIndex',
        'users.password',
        'users.salt',
        'users.status',
        'users.accessLevel',
      ])
      .where('users.id = :id', { id })
      .getOne();
  }

  async findNickname(nickname: string) {
    return await this.userRepository
      .createQueryBuilder('users')
      .where('users.nickname = :nickname', { nickname })
      .getExists();
  }

  async updateNickname(userIndex: string, nickname: string) {
    await this.userRepository
      .createQueryBuilder('users')
      .update()
      .set({ nickname })
      .where('users.userIndex = userIndex', { userIndex })
      .execute();
  }
}
