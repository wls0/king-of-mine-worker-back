import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
@Injectable()
export class RedisService {
  redis: Redis = new Redis(process.env.REDIS);

  async zrange(data: {
    name: string;
    start: number;
    end: number;
    optionStatus: boolean;
  }) {
    const { name, start, end, optionStatus } = data;
    if (optionStatus) {
      return await this.redis.zrange(name, start, end, 'WITHSCORES');
    } else {
      return await this.redis.zrange(name, start, end);
    }
  }

  async zscore(data: { name: string; index: string }) {
    const { name, index } = data;
    return await this.redis.zscore(name, index);
  }

  async zadd(data: { name: string; point: number; index: string }) {
    const { name, point, index } = data;
    await this.redis.zadd(name, point, index);
  }

  async expire(data: { name: string; time: number }) {
    const { name, time } = data;
    await this.redis.expire(name, time);
  }

  async del(data: string) {
    await this.redis.del(data);
  }

  async set(data: { name: string; content: string }) {
    const { name, content } = data;
    await this.redis.set(name, content);
  }

  async get(data: string) {
    return await this.redis.get(data);
  }
}
