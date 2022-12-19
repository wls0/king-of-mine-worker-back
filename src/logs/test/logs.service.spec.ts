import { Test, TestingModule } from '@nestjs/testing';
import { LogsService } from '../logs.service';
import { LogRepository } from '../logs.repository';
jest.mock('../logs.repository.ts');
describe('LogsService', () => {
  let service: LogsService;
  let logRepository: LogRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogsService, LogRepository],
    }).compile();

    service = module.get<LogsService>(LogsService);
    logRepository = module.get<LogRepository>(LogRepository);
  });

  describe('findLog', () => {
    it('Type is function', () => {
      expect(typeof service.findLog).toBe('function');
    });
    it('호출 확인 LogRepository.findLog', async () => {
      const type = 'item';
      const startDate = '2022-12-15';
      const endDate = '2022-12-19';
      await service.findLog({ type, startDate, endDate });
      expect(logRepository.findLog).toBeCalled();
    });
  });

  describe('saveLog', () => {
    const id = { user: '유저Index값' };
    const log = [{ category: 'use' }];
    const data = { type: 'item', log };
    it('Type is function', () => {
      expect(typeof service.saveLog).toBe('function');
    });
    it('호출 확인 LogRepository.saveLog', async () => {
      await service.saveLog(id, data);
      expect(logRepository.saveLog).toBeCalledWith(id, data);
    });
  });
});
