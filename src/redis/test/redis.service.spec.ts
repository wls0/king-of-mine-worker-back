import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from '../redis.service';

describe('RedisService', () => {
  let service: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisService],
    }).compile();

    service = module.get<RedisService>(RedisService);
  });

  it('zrange', () => {
    expect(typeof service.zrange).toBe('function');
  });
  it('zscore', () => {
    expect(typeof service.zscore).toBe('function');
  });
  it('zadd', () => {
    expect(typeof service.zadd).toBe('function');
  });
  it('del', () => {
    expect(typeof service.del).toBe('function');
  });
  it('set', () => {
    expect(typeof service.set).toBe('function');
  });
  it('get', () => {
    expect(typeof service.get).toBe('function');
  });
});
