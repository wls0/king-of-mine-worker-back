import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserMainDto, NickNameDto, UserIdDto } from './dto/users.dto';
import { UsersRepository } from './users.repository';
import { passwordMaker, passwordDecoding } from './utils/util';
import { LogsService } from '../logs/logs.service';
import { SaveLogDto } from '../logs/dto/logs.dto';
@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly logService: LogsService,
  ) {}
  async findId(param: UserIdDto) {
    const { id } = param;
    const user = await this.usersRepository.findUser(id);
    if (user) {
      throw new ConflictException();
    } else {
      return '';
    }
  }

  async createUser(body: UserMainDto) {
    const { id, password } = body;
    await this.findId({ id });
    const { makePassword, salt } = passwordMaker(password);
    const userIndex = await this.usersRepository.createUser({
      id,
      password: makePassword,
      salt,
    });
    const saveLog: SaveLogDto = {
      type: 'account',
      log: { title: 'createAccount' },
    };
    await this.logService.saveLog(userIndex, saveLog);
    return '';
  }

  async login(body: UserMainDto) {
    const { id, password } = body;
    const user = await this.usersRepository.getUserLoginInfo(id);
    if (user) {
      const passwordCheck = passwordDecoding({
        password: password,
        salt: user.salt,
      });
      if (user.password === passwordCheck) {
        const token = this.jwtService.sign(
          {
            userIndex: user.userIndex,
            status: user.status,
            accessLevel: user.accessLevel,
          },
          { secret: process.env.JWT },
        );
        const saveLog: SaveLogDto = {
          type: 'account',
          log: { title: 'login' },
        };
        await this.logService.saveLog(user.userIndex, saveLog);
        return token;
      } else {
        throw new UnauthorizedException();
      }
    } else {
      throw new NotFoundException();
    }
  }

  async findNickname(param: NickNameDto) {}

  async changeNickname(body: NickNameDto) {}
}
