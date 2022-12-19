import { Test, TestingModule } from '@nestjs/testing';
import { FindLogDto } from '../dto/logs.dto';
import { LogsController } from '../logs.controller';
import { LogsService } from '../logs.service';
jest.mock('../logs.service.ts');
describe('LogsController', () => {
  let controller: LogsController;
  let logsService: LogsService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogsController],
    }).compile();
    logsService = module.get<LogsService>(LogsService);
    controller = module.get<LogsController>(LogsController);
  });

  describe('findLog', () => {
    const param: FindLogDto = {
      type: 'item',
      startDate: '2022-12-10',
      endDate: '2022-12-19',
    };
    it('Type is function', async () => {
      expect(typeof controller.findLog).toBe('function');
    });
    it('호출 확인 logsService.findLog', async () => {
      await controller.findLog(param);
      expect(logsService.findLog).toBeCalledWith(param);
    });
  });
});
