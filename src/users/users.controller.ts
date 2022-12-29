import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/user.decorators';
import { UserMainDto, NickNameDto, UserIdDto } from './dto/users.dto';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { jwtPayload } from './jwt/jwt.payload';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('id/:id')
  @ApiOperation({ summary: '아이디 확인' })
  async findId(@Param() param: UserIdDto) {
    return await this.usersService.findId(param);
  }

  @Post()
  @ApiOperation({ summary: '회원 가입' })
  async createUser(@Body() body: UserMainDto) {
    return await this.usersService.createUser(body);
  }

  @Post('login')
  @ApiOperation({ summary: '로그인' })
  async login(@Body() body: UserMainDto) {
    return await this.usersService.login(body);
  }

  @Get('nickname/:nickname')
  @ApiOperation({ summary: '닉네임 확인' })
  async findNickname(@Param() param: NickNameDto) {
    return await this.usersService.findNickname(param);
  }

  @ApiOperation({ summary: '닉네임 변경' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('nickname')
  async changeNickname(
    @CurrentUser() user: jwtPayload,
    @Body() body: NickNameDto,
  ) {
    return await this.usersService.changeNickname(user, body);
  }
}
