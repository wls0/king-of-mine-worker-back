import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import { Model } from 'mongoose';
import { Logs } from '../model/logs.model';
import { SaveLogDto } from './dto/logs.dto';

@Injectable()
export class LogRepository {
  constructor(@InjectModel(Logs.name) private readonly logModel: Model<Logs>) {}
  async findLog(data: { type: string; start: Date; end: Date }) {
    const { type, start, end } = data;
    return await this.logModel
      .find()
      .select({ [`${type}Log`]: 1, user: 1 })
      .gte('createdAt', start)
      .lte('createdAt', end);
  }

  async saveLog(user: string, data: SaveLogDto) {
    const { type, log } = data;
    const now = new Date();
    const date = dayjs(now).format('YYYY-MM-DD');
    const savedLog = await this.logModel.findOne({ user, date });
    log.time = new Date();

    if (savedLog) {
      await this.logModel.findOneAndUpdate(
        { _id: user },
        { $push: { [`${type}Log`]: log } },
      );
    } else {
      await this.logModel.create({ user, date, [`${type}Log`]: [log] });
    }
  }
}
