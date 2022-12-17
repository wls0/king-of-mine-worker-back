import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Logs } from '../model/logs.model';

@Injectable()
export class LogRepository {
  constructor(@InjectModel(Logs.name) private readonly logModel: Model<Logs>) {}
}
