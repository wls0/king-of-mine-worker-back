import { Controller, Get, Body, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { jwtPayload } from '../auth/jwt.payload';
import { CurrentUser } from '../common/decorators/user.decorators';
import { CommunitiesService } from './communities.service';
import { ReceiveGoldDTO, SendGoldDTO } from './dto/communities.dto';

@UseGuards(JwtAuthGuard)
@Controller('communities')
@ApiTags('communities')
export class CommunitiesController {
  constructor(private readonly communitiesService: CommunitiesService) {}

  @Get('send')
  @ApiOperation({ summary: '보낸 선물 목록 확인' })
  async findSendGiftList(@CurrentUser() user: jwtPayload) {
    return await this.communitiesService.findSendGiftList(user);
  }

  @Get('receive')
  @ApiOperation({ summary: '받은 선물 목록 확인' })
  async findReceiveGiftList(@CurrentUser() user: jwtPayload) {
    return await this.communitiesService.findReceiveGiftList(user);
  }

  @Post('send')
  @ApiOperation({ summary: '선물 보내기' })
  async sendGift(@CurrentUser() user: jwtPayload, @Body() body: SendGoldDTO) {
    return await this.communitiesService.sendGift(user, body);
  }

  @Patch('receive')
  @ApiOperation({ summary: '선물 받기' })
  async receiveGift(
    @CurrentUser() user: jwtPayload,
    @Body() body: ReceiveGoldDTO,
  ) {
    return await this.communitiesService.receiveGift(user, body);
  }
}
