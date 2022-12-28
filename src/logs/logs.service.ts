import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { FindLogDto, SaveLogDto } from './dto/logs.dto';
import { LogRepository } from './logs.repository';

@Injectable()
export class LogsService {
  constructor(private readonly logRepository: LogRepository) {}
  async findLog(data: FindLogDto) {
    const { type, startDate, endDate } = data;
    const start = dayjs(new Date(startDate))
      .subtract(1, 'day')
      .set('hours', 5)
      .set('minutes', 0)
      .set('seconds', 0)
      .toDate();

    const end = dayjs(new Date(endDate))
      .set('hours', 15)
      .set('minutes', 0)
      .set('seconds', 0)
      .toDate();

    const log = await this.logRepository.findLog({ type, start, end });
    return log;
  }

  async saveLog(user: string, data: SaveLogDto) {
    await this.logRepository.saveLog(user, data);
  }
}
