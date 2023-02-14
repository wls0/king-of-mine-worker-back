import { Injectable } from '@nestjs/common';
import {
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { SaveLogDto } from '../logs/dto/logs.dto';
import { jwtPayload } from '../auth/jwt.payload';
import {
  CompanyRankDTO,
  PlayGameDTO,
  StageInfoDto,
  UpgradeItemDTO,
  UseGoldDTO,
} from './dto/games.dto';
import { GamesRepository } from './games.repository';
import { LogsService } from '../logs/logs.service';
@Injectable()
export class GamesService {
  constructor(
    private readonly gamesRepository: GamesRepository,
    private readonly logsService: LogsService,
  ) {}
  // 진행중인 스테이지 확인
  async findStage(user: jwtPayload) {
    return await this.gamesRepository.findUserGameInfo(user.userIndex);
  }

  // 스테이지 난이도 확인
  async findStageLevelInfo(param: StageInfoDto) {
    return await this.gamesRepository.findStageInfo(param.stage);
  }

  // 골드 사용
  async useGold(user: jwtPayload, useGold: UseGoldDTO) {
    const { userIndex } = user;
    const { gold } = await this.findItem(user);
    const { use, type, log } = useGold;

    let finalGold: number;

    if (use) {
      finalGold = gold + useGold.gold;
    } else {
      finalGold = gold - useGold.gold;
      if (finalGold < 0) {
        throw new ForbiddenException();
      }
    }

    this.gamesRepository.useGold(userIndex, finalGold);
    this.logsService.saveLog(userIndex, { type, log });
    return '';
  }

  // 유저 게임 정보 업데이트
  async playGame(user: jwtPayload, body: PlayGameDTO) {
    const { userIndex } = user;
    const { stage, coal, bronze, silver, emerald, amethyst, diamond, lithium } =
      body;

    const stageCheck = await this.gamesRepository.findStageInfo(stage);

    if (
      coal < stageCheck.coal ||
      bronze < stageCheck.bronze ||
      silver < stageCheck.silver ||
      emerald < stageCheck.emerald ||
      amethyst < stageCheck.amethyst ||
      diamond < stageCheck.diamond ||
      lithium < stageCheck.lithium
    ) {
      throw new ForbiddenException();
    }
    const { level, exp } = await this.gamesRepository.findUserGameInfo(
      userIndex,
    );
    let saveExp = 0;
    let saveLevel = 0;
    saveExp = exp;
    saveLevel = level;
    saveExp += 50;
    if (saveExp >= 150) {
      saveLevel += 1;
      saveExp = 0;
    }
    const gold = Math.floor(Math.random() * 300) + 100;
    const goldLog: UseGoldDTO = {
      gold,
      use: true,
      type: 'stage',
      log: { title: 'playGame', gold },
    };

    const gameSaveLog: SaveLogDto = {
      type: 'stage',
      log: {
        title: 'playGame',
        stage: stage + 1,
        level: saveLevel,
        exp: saveExp,
      },
    };

    const gameSave = {
      stage: stage + 1,
      level: saveLevel,
      exp: saveExp,
    };
    Promise.all([
      this.useGold(user, goldLog),
      this.gamesRepository.updateUserPlayGame(userIndex, gameSave),
    ]);

    this.logsService.saveLog(userIndex, gameSaveLog);
  }

  // 회사 순위 확인 redis 사용
  async findCompanyRank(user: jwtPayload) {
    const { userIndex } = user;
    let myCompany: string = null;
    const companyCheck = await this.gamesRepository.findCompanyInfo(userIndex);
    if (companyCheck) {
      const { companyIndex } = companyCheck;
      myCompany = companyIndex;
    }

    const totalRank = await this.gamesRepository.findCompanyRank();
    const companyBox = [];
    const companyPointBox = [];
    const commondBox = [];
    let count = 0;
    for (const a of totalRank) {
      if (count % 2 === 0) {
        commondBox.push(this.gamesRepository.findCompanyName(a));
        companyBox.push({
          companyIndex: a,
        });
      } else {
        companyPointBox.push(Number(a));
      }
      count++;
    }
    const companyNameList = await Promise.all(commondBox);

    let companyListCount = 0;
    for (const b of companyBox) {
      b.companyName = companyNameList[companyListCount];
      b.point = companyPointBox[companyListCount];
      companyListCount++;
    }

    return { companyBox, myCompany };
  }

  // 회사 순위 변경 redis 사용
  async updateCompanyRank(user: jwtPayload, data: CompanyRankDTO) {
    const { userIndex } = user;
    const { point } = data;
    const { companyIndex } = await this.gamesRepository.findCompanyInfo(
      userIndex,
    );
    if (!companyIndex) {
      throw new NotFoundException();
    }
    let savePoint = 0;
    const companyPoint = await this.gamesRepository.findMyCompanyPoint(
      companyIndex,
    );

    if (companyPoint) {
      savePoint = Number(companyPoint) + point;
    } else {
      savePoint = point;
    }

    await this.gamesRepository.updateCompanyRank({
      companyIndex: companyIndex,
      point: savePoint,
    });

    return '';
  }

  //보유 아이탬 확인
  async findItem(user: jwtPayload) {
    return await this.gamesRepository.findHaveUserItem(user.userIndex);
  }

  //보유 아이탬 업그레이드
  async upgradeItem(user: jwtPayload, body: UpgradeItemDTO) {
    const { category } = body;
    const haveItem = await this.findItem(user);
    const gold = haveItem[`${category}`] * 50;
    const useGold: UseGoldDTO = {
      gold,
      use: false,
      type: 'item',
      log: { title: 'useGold', use: false, gold },
    };
    const itemLevel = haveItem[`${category}`] + 1;
    const upgradeItem = {
      category,
      itemLevel: itemLevel,
    };
    const saveLog: SaveLogDto = {
      type: 'item',
      log: { title: 'updateItem', category, itemLevel },
    };
    this.useGold(user, useGold);
    this.gamesRepository.upgradeItem(user.userIndex, upgradeItem);
    this.logsService.saveLog(user.userIndex, saveLog);
  }
}
