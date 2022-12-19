import { Injectable } from '@nestjs/common';
import { UserMainDto, NickNameDto, UserIdDto } from './dto/users.dto';
import { UsersRepository } from './users.repository';
@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  async findId(param: UserIdDto) {
    const { id } = param;
  }

  async createUser(body: UserMainDto) {
    const { id, password } = body;
  }

  async login(body: UserMainDto) {}

  async findNickname(param: NickNameDto) {}

  async changeNickname(body: NickNameDto) {}
}
