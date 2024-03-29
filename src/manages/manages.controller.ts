import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Body, Param } from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ManagerAuthGuard } from '../auth/jwt.guard';
import {
  GameInfoDTO,
  GameStageDTO,
  UpdateGameStageDTO,
  UserMainDto,
  UserSelectDTO,
  UserStatusSettingDTO,
} from './dto/manages.dto';
import { ManagesService } from './manages.service';

@ApiBearerAuth()
@ApiTags('manages')
@Controller('manages')
export class ManagesController {
  constructor(private readonly managesService: ManagesService) {}

  @UseGuards(ManagerAuthGuard)
  @Get('stage/info/:stage')
  @ApiOperation({ summary: '스테이지 난이도 확인' })
  async findStageInfo(@Param() param: GameInfoDTO) {
    return await this.managesService.findStageInfo(param);
  }

  @UseGuards(ManagerAuthGuard)
  @Post('stage')
  @ApiOperation({ summary: '스테이지 생성' })
  async createStage(@Body() body: GameStageDTO) {
    return await this.managesService.createStage(body);
  }

  @UseGuards(ManagerAuthGuard)
  @Patch('stage')
  @ApiOperation({ summary: '스테이지 수정' })
  async updateStageInfo(@Body() body: UpdateGameStageDTO) {
    return await this.managesService.updateStageInfo(body);
  }

  @UseGuards(ManagerAuthGuard)
  @Get('users/:id')
  @ApiOperation({ summary: '유저 상태 값 확인' })
  async findUserStatus(@Param() param: UserSelectDTO) {
    return await this.managesService.findUserStatus(param);
  }

  @UseGuards(ManagerAuthGuard)
  @Patch('users')
  @ApiOperation({ summary: '유저 상태 값 수정' })
  async updateUserStatus(@Body() body: UserStatusSettingDTO) {
    return await this.managesService.updateUserStatus(body);
  }

  @UseGuards(ManagerAuthGuard)
  @Delete('users/:id')
  @ApiOperation({ summary: '유저 삭제' })
  async deleteUser(@Param() param: UserSelectDTO) {
    return await this.managesService.deleteUser(param);
  }

  @Post('login')
  @ApiOperation({ summary: '관리자 로그인' })
  async managerLogin(@Body() param: UserMainDto) {
    return await this.managesService.managerLogin(param);
  }
}
