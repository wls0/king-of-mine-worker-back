import { Injectable } from '@nestjs/common/decorators';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gifts } from '../model/gifts.model';
@Injectable()
export class CommunitiesRepository {
  constructor(
    @InjectRepository(Gifts) private giftsRepository: Repository<Gifts>,
  ) {}
  async findSendGiftList(user: string) {
    return await this.giftsRepository
      .createQueryBuilder('gift')
      .select()
      .where('gift.sendUser = :sendUser', { sendUser: user })
      .getRawMany();
  }

  async findReceiveGiftList(user: string) {
    return await this.giftsRepository
      .createQueryBuilder('gift')
      .select()
      .where('gift.receiveUser = :receiveUser', { receiveUser: user })
      .getRawMany();
  }

  async sendGift(
    user: string,
    data: { receiveUser: string; gold: number; message: string },
  ) {
    const { receiveUser, gold, message } = data;
    return await this.giftsRepository
      .createQueryBuilder('gift')
      .insert()
      .values({ sendUser: user, receiveUser, gold, message, status: false })
      .execute();
  }

  async receiveGift(giftIndex: string) {
    return await this.giftsRepository
      .createQueryBuilder('gift')
      .update()
      .set({ status: true })
      .where('gift.index = :giftIndex', { giftIndex })
      .execute();
  }
}
