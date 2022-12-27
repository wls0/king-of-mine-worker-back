import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserMainDto, NickNameDto, UserIdDto } from './dto/users.dto';
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

  @Get('nickname/:id')
  async findNickname(param: NickNameDto) {
    await this.usersService.findNickname(param);
  }

  @Patch('nickname')
  async changeNickname(body: NickNameDto) {
    await this.usersService.changeNickname(body);
  }
}
