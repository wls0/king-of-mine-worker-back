import { Injectable } from '@nestjs/common';
import {
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { UseGoldDTO } from 'src/games/dto/games.dto';
import { jwtPayload } from '../auth/jwt.payload';
import { GamesService } from '../games/games.service';
import { CommunitiesRepository } from './communities.repository';
import { SendGoldDTO, ReceiveGoldDTO } from './dto/communities.dto';

@Injectable()
export class CommunitiesService {
  constructor(
    private readonly gamesService: GamesService,
    private readonly communitiesRepository: CommunitiesRepository,
  ) {}
  //보낸 선물 목록 리스트 확인
  async findSendGiftList(user: jwtPayload) {
    const { userIndex } = user;
    return await this.communitiesRepository.findSendGiftList(userIndex);
  }

  //받은 선물 리스트 확인
  async findReceiveGiftList(user: jwtPayload) {
    const { userIndex } = user;
    return await this.communitiesRepository.findReceiveGiftList(userIndex);
  }

  //선물 보내기
  async sendGift(user: jwtPayload, body: SendGoldDTO) {
    const { userIndex } = user;
    const { gold, receiveUser } = body;
    const useGold: UseGoldDTO = {
      gold,
      use: false,
      type: 'company',
      log: undefined,
    };

    const [userStaff, receiveStaff] = await Promise.all([
      this.communitiesRepository.findCompanyUser(userIndex),
      this.communitiesRepository.findCompanyUser(receiveUser),
    ]);

    if (userStaff.companyIndex !== receiveStaff.companyIndex) {
      throw new ForbiddenException();
    }

    await this.gamesService.useGold(user, useGold);
    await this.communitiesRepository.sendGift(userIndex, body);
    return '';
  }

  //선물 받기
  async receiveGift(user: jwtPayload, body: ReceiveGoldDTO) {
    const { userIndex } = user;
    const { giftIndex } = body;

    const giftInfo = await this.communitiesRepository.findGiftInfo(giftIndex);

    if (!giftInfo) {
      throw new NotFoundException();
    }

    if (giftInfo.receiveUser !== userIndex || giftInfo.status === true) {
      throw new ForbiddenException();
    }
    const useGold: UseGoldDTO = {
      gold: giftInfo.gold,
      use: true,
      type: 'company',
      log: undefined,
    };

    await Promise.all([
      this.gamesService.useGold(user, useGold),
      this.communitiesRepository.receiveGift(giftIndex),
    ]);

    return '';
  }
}
