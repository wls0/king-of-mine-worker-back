import { Controller } from '@nestjs/common';
import { Get, Param } from '@nestjs/common/decorators';
import { FindLogDto } from './dto/logs.dto';
import { LogsService } from './logs.service';
@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get('/:type/:startDate/:endDate')
  async findLog(@Param() param: FindLogDto) {
    await this.logsService.findLog(param);
  }
}
