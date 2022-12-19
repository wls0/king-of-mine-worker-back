import { Controller, Get, Patch, Post } from '@nestjs/common';
import { UserMainDto, NickNameDto, UserIdDto } from './dto/users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('id/:id')
  async findId(param: UserIdDto) {
    await this.usersService.findId(param);
  }

  @Post()
  async createUser(body: UserMainDto) {
    await this.usersService.createUser(body);
  }

  @Post('login')
  async login(body: UserMainDto) {
    await this.usersService.login(body);
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
