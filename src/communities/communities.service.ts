import { Injectable } from '@nestjs/common';
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
  }

  //선물 받기
  async receiveGift(user: jwtPayload, body: ReceiveGoldDTO) {
    const { userIndex } = user;
  }
}
