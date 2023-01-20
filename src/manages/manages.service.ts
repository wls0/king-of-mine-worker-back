import { Injectable, NotFoundException } from '@nestjs/common';
import {
  GameInfoDTO,
  GameStageDTO,
  UpdateGameStageDTO,
  UserSelectDTO,
  UserStatusSettingDTO,
} from './dto/manages.dto';
import { ManagesRepository } from './manages.repository';

@Injectable()
export class ManagesService {
  constructor(private readonly managesRepository: ManagesRepository) {}

  //스테이지 정보 확인
  async findStageInfo(param: GameInfoDTO) {
    const { stage } = param;

    return await this.managesRepository.findStageInfo(stage);
  }

  //스테이지 생성
  async createStage(body: GameStageDTO) {
    await this.managesRepository.createStage(body);
    return '';
  }

  //스테이지 업데이트
  async updateStageInfo(body: UpdateGameStageDTO) {
    const { stage } = body;
    const stageCheck = await this.managesRepository.findStageInfo(stage);

    if (!stageCheck) {
      throw new NotFoundException();
    }

    await this.managesRepository.updateStageInfo(body);
    return '';
  }

  //유저 상태 값 확인
  async findUserStatus(param: UserSelectDTO) {
    const { id } = param;
    return await this.managesRepository.findUserStatus(id);
  }

  //유저 상태 값 수정
  async updateUserStatus(body: UserStatusSettingDTO) {
    const { id } = body;

    const userCheck = await this.managesRepository.findUserStatus(id);

    if (!userCheck) {
      throw new NotFoundException();
    }

    await this.managesRepository.updateUserStatus(body);
    return '';
  }

  //유저 삭제
  async deleteUser(param: UserSelectDTO) {
    const { id } = param;

    await this.managesRepository.deleteUser(id);
    return '';
  }
}
