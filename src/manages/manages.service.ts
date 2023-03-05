import {
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CompaniesRepository } from '../companies/companies.repository';
import { GamesRepository } from '../games/games.repository';
import {
  GameInfoDTO,
  GameStageDTO,
  UpdateGameStageDTO,
  UserMainDto,
  UserSelectDTO,
  UserStatusSettingDTO,
} from './dto/manages.dto';
import { ManagesRepository } from './manages.repository';

@Injectable()
export class ManagesService implements OnApplicationBootstrap {
  constructor(
    private readonly managesRepository: ManagesRepository,
    private readonly gamesRepository: GamesRepository,
    private readonly companiesRepository: CompaniesRepository,
  ) {}

  async onApplicationBootstrap() {
    const manager = await this.managesRepository.managerFind();
    if (!manager) {
      await this.managesRepository.managerCraete();
    }
  }

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
    const userCheck = await this.managesRepository.findUserStatus(id);

    if (!userCheck) {
      throw new NotFoundException();
    }

    await this.managesRepository.deleteUser(id, userCheck.userIndex);
    return '';
  }

  //회사 주간 랭킹 1~3위 보상 [월요일 00시 00분 00초 작동]
  @Cron('0 0 0 * * 1', { timeZone: 'Asia/Seoul' })
  async weeklyCompanyRankReward() {
    const totalCompanyRank = await this.gamesRepository.findCompanyRank();
    if (totalCompanyRank) {
      let rank = 0;
      let count = 0;
      const companyBox = [];
      for (const a of totalCompanyRank) {
        if (count % 2 === 0) {
          companyBox.push(a);
        } else {
          if (rank <= Number(a)) {
            rank = Number(a);
          } else {
            companyBox.pop();
            break;
          }
        }
        count++;
      }

      for (const b of companyBox) {
        const returnData = await this.companiesRepository.findStaffList(
          b,
          true,
        );
        for (const c of returnData) {
          await this.managesRepository.sendCompanyRankReward(c.user);
        }
      }
    }
    await this.managesRepository.deleteRank();
  }
  async managerLogin(body: UserMainDto) {}
}
