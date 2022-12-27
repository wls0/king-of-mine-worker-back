import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { Model } from 'mongoose';
import { Logs } from '../model/logs.model';
import { Users } from '../model/users.model';
@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(Logs.name) private readonly logsModel: Model<Logs>,
    @InjectRepository(Users) private userRepository: Repository<Users>,
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
    await this.userRepository
      .createQueryBuilder('users')
      .insert()
      .values({ id, password, salt })
      .execute();
  }

  async getUserLoginInfo(id: string) {
    return await this.userRepository
      .createQueryBuilder('users')
      .select(['users.userIndex', 'users.password', 'users.salt'])
      .where('users.id = :id', { id })
      .getOne();
  }
}
