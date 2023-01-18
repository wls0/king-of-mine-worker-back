import { Controller, Get, UseGuards, Body, Patch, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { jwtPayload } from '../auth/jwt.payload';
import { CurrentUser } from '../common/decorators/user.decorators';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { GamesService } from './games.service';
import {
  CompanyRankDTO,
  PlayGameDTO,
  StageInfoDto,
  UpgradeItemDTO,
} from './dto/games.dto';
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('games')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get('stage')
  @ApiOperation({ summary: '현제 게임 정보' })
  async findStage(@CurrentUser() user: jwtPayload) {
    return await this.gamesService.findStage(user);
  }

  @Get('stage/mineral/:stage')
  @ApiOperation({ summary: '스테이지 난이도 확인' })
  async findStageLevelInfo(@Param() param: StageInfoDto) {
    return await this.gamesService.findStageLevelInfo(param);
  }

  @Patch()
  @ApiOperation({ summary: '게임 진행 (광물 채집)' })
  async playGame(@CurrentUser() user: jwtPayload, @Body() body: PlayGameDTO) {
    return await this.gamesService.playGame(user, body);
  }

  @Get('item')
  @ApiOperation({ summary: '보유중인 아이탬 확인' })
  async findItem(@CurrentUser() user: jwtPayload) {
    return await this.gamesService.findItem(user);
  }

  @Patch('item')
  @ApiOperation({ summary: '보유 아이탬 업그레이드' })
  async upgradeItem(
    @CurrentUser() user: jwtPayload,
    @Body() body: UpgradeItemDTO,
  ) {
    return await this.gamesService.upgradeItem(user, body);
  }

  @Get('company/rank')
  @ApiOperation({ summary: '길드 순위 확인' })
  async findCompanyRank(@CurrentUser() user: jwtPayload) {
    return await this.gamesService.findCompanyRank(user);
  }

  @Patch('company/rank')
  @ApiOperation({ summary: '길드 순위 업데이트' })
  async updateCompanyRank(
    @CurrentUser() user: jwtPayload,
    @Body() body: CompanyRankDTO,
  ) {
    return await this.gamesService.updateCompanyRank(user, body);
  }
}
