import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
@Injectable()
export class LoginSocketsService {
  redis: Redis = new Redis(process.env.REDIS);

  async login(socket: string, payload: any) {
    const { userIndex } = payload;
    if (!userIndex) {
      return {
        event: 'error',
        data: null,
        message: 'userIndex is null',
        socket,
      };
    }

    const beforSocket = await this.redis.get(userIndex);
    if (beforSocket) {
      await this.redis.del(beforSocket);
      await this.redis.set(userIndex, '');
      return {
        event: 'error',
        data: null,
        message: 'duplicate login',
        socket: beforSocket,
      };
    } else {
      await this.redis.set(userIndex, socket);
      await this.redis.set(socket, userIndex);
      await this.redis.expire(userIndex, 1000 * 60 * 60 * 24);
      return {
        event: 'loginSuccess',
        data: null,
        message: '',
        socket,
      };
    }
  }

  async disconnect(socket: string) {
    const userIndex = await this.redis.get(socket);
    await this.redis.del(userIndex);
    await this.redis.del(socket);
  }
}
