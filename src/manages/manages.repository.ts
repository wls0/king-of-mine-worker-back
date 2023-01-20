import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Stages } from '../model/stages.model';
import { Repository } from 'typeorm';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import {
  GameStageDTO,
  UpdateGameStageDTO,
  UserStatusSettingDTO,
} from './dto/manages.dto';
import { Users } from '../model/users.model';

@Injectable()
export class ManagesRepository {
  constructor(
    @InjectRepository(Stages) private stagesRepository: Repository<Stages>,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async findStageInfo(stage: number) {
    return this.stagesRepository
      .createQueryBuilder('stages')
      .select()
      .where('stages.stage = :stage', { stage })
      .getOne();
  }

  async createStage(data: GameStageDTO) {
    const {
      coal,
      bronze,
      silver,
      emerald,
      amethyst,
      diamond,
      lithium,
      useDynamite,
    } = data;

    await this.stagesRepository
      .createQueryBuilder('stages')
      .insert()
      .values({
        coal,
        bronze,
        silver,
        emerald,
        amethyst,
        diamond,
        lithium,
        useDynamite,
      })
      .execute();
  }
  async updateStageInfo(data: UpdateGameStageDTO) {
    const {
      coal,
      bronze,
      silver,
      emerald,
      amethyst,
      diamond,
      lithium,
      useDynamite,
      stage,
    } = data;
    await this.stagesRepository
      .createQueryBuilder('stages')
      .update()
      .set({
        coal,
        bronze,
        silver,
        emerald,
        amethyst,
        diamond,
        lithium,
        useDynamite,
      })
      .where('stages.stage = :stage', { stage })
      .execute();
  }

  async findUserStatus(id: string) {
    return await this.usersRepository
      .createQueryBuilder('users')
      .select(['status'])
      .where('users.id = :id', { id })
      .getOne();
  }

  async updateUserStatus(data: UserStatusSettingDTO) {
    const { id, status } = data;

    await this.usersRepository
      .createQueryBuilder('users')
      .update()
      .set({ status })
      .where('users.id = :id', { id })
      .execute();
  }

  async deleteUser(id: string) {
    await this.usersRepository
      .createQueryBuilder('users')
      .delete()
      .where('users.id =:id', { id })
      .execute();
  }
}
